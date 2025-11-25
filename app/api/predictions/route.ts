import { NextRequest, NextResponse } from 'next/server';
import {
  insertPrediction,
  getAllPredictions,
  getRecentPredictions,
} from '@/lib/db';

// GET - Get all predictions or recent predictions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    let predictions;
    if (limit) {
      predictions = getRecentPredictions(parseInt(limit));
    } else {
      predictions = getAllPredictions();
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

    const { imageName, imageUrl, predictedClass, confidence, probabilityBleached, probabilityHealthy } = body;

    // Validate required fields
    if (!imageName || !predictedClass || confidence === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = insertPrediction({
      imageName,
      imageUrl,
      predictedClass,
      confidence,
      probabilityBleached,
      probabilityHealthy,
    });

    return NextResponse.json({
      success: true,
      message: 'Prediction saved successfully',
      data: { id: result.lastInsertRowid },
    });
  } catch (error) {
    console.error('Error saving prediction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save prediction' },
      { status: 500 }
    );
  }
}
