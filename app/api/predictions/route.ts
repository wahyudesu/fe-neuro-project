import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  insertPrediction,
  getAllPredictions,
  getRecentPredictions,
  initDatabase,
} from '@/lib/db';
import { predictImage } from '@/lib/predict';

// Kick off DB initialization at module load so we can detect any issues early.
void initDatabase().then(() => {
  console.log('✅ Database initialized successfully');
}).catch((err) => {
  console.warn('⚠️ DB initialization failed at startup:', err?.message ?? err);
});

// GET - Get all predictions or recent predictions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    let predictions;
    if (limit) {
      predictions = await getRecentPredictions(parseInt(limit));
    } else {
      predictions = await getAllPredictions();
    }

    return NextResponse.json({
      success: true,
      data: predictions,
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}

// POST - Create new prediction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { imageName, imageUrl, imageBase64, predictedClass, confidence, probabilityBleached, probabilityHealthy } = body;

    // Basic validation - imageName required; predictions optional (we default to Pending if missing)
    if (!imageName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If an image is provided as base64, save it locally into public/coral-images
    let savedImageUrl = imageUrl;
    if (imageBase64) {
      try {
        // Extract base64 payload and detect mime
        const matches = /^data:(image\/[^;]+);base64,(.+)$/.exec(imageBase64);
        let base64Data = imageBase64;
        let ext = 'jpg';
        if (matches) {
          const mime = matches[1];
          const payload = matches[2];
          base64Data = payload;
          if (mime === 'image/png') ext = 'png';
          else if (mime === 'image/gif') ext = 'gif';
          else if (mime === 'image/webp') ext = 'webp';
          else if (mime === 'image/jpeg') ext = 'jpg';
        } else if (imageBase64.startsWith('/')) {
          // If the client sends raw base64 without data:, attempt to clean it
          const idx = imageBase64.indexOf('base64,');
          if (idx !== -1) {
            base64Data = imageBase64.slice(idx + 7);
          }
        }

        // Sanitize name and generate unique filename
        const safe = (imageName || 'upload').replace(/[^a-z0-9_.-]/gi, '-').slice(0, 100);
        const fileName = `${Date.now()}-${safe}.${ext}`;
        const publicPath = path.join(process.cwd(), 'public', 'coral-images');
        try {
          fs.mkdirSync(publicPath, { recursive: true });
        } catch (mkdirErr) {
          console.warn('⚠️ Could not create public coral-images dir:', mkdirErr);
        }
        const diskPath = path.join(publicPath, fileName);
        fs.writeFileSync(diskPath, Buffer.from(base64Data, 'base64'));
        savedImageUrl = `/coral-images/${fileName}`;
      } catch (fsErr) {
        console.error('Error saving uploaded image:', fsErr);
        return NextResponse.json(
          { success: false, error: 'Failed to save uploaded image' },
          { status: 500 }
        );
      }
    }

    // If image was saved, run prediction on it
    let predictionResult = {
      predictedClass: predictedClass ?? 'Pending',
      confidence: confidence ?? 0,
      probabilityBleached: probabilityBleached ?? 0,
      probabilityHealthy: probabilityHealthy ?? 0,
    };

    if (savedImageUrl && savedImageUrl.startsWith('/coral-images/')) {
      try {
        // Get full path to saved image
        const imageFullPath = path.join(process.cwd(), 'public', savedImageUrl);

        // Run prediction
        const prediction = await predictImage(imageFullPath);
        predictionResult = {
          predictedClass: prediction.predictedClass,
          confidence: prediction.confidence,
          probabilityBleached: prediction.probabilityBleached,
          probabilityHealthy: prediction.probabilityHealthy,
        };

        console.log('✅ Prediction completed for uploaded image:', predictionResult);
      } catch (predictError) {
        console.warn('⚠️ Prediction failed for uploaded image, using placeholder values:', predictError);
        // Keep the placeholder values if prediction fails
      }
    }

    // Insert into database
  const result = await insertPrediction({
      imageName,
      imageUrl: savedImageUrl,
      predictedClass: predictionResult.predictedClass,
      confidence: predictionResult.confidence,
      probabilityBleached: predictionResult.probabilityBleached,
      probabilityHealthy: predictionResult.probabilityHealthy,
    });

    return NextResponse.json({
      success: true,
      message: 'Prediction saved successfully',
      data: { 
        id: result.lastInsertRowid,
        prediction: predictionResult,
        imageUrl: savedImageUrl
      },
    });
  } catch (error) {
    console.error('Error saving prediction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save prediction' },
      { status: 500 }
    );
  }
}
