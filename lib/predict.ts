import fs from 'fs';
import path from 'path';

interface PredictionResult {
  predictedClass: string;
  confidence: number;
  probabilityBleached: number;
  probabilityHealthy: number;
}

let model: unknown = null;

// Load model (singleton pattern)
async function loadModel(): Promise<unknown> {
  if (model) return model;

  try {
    // Dynamically import TensorFlow.js for Node.js to avoid build issues
    // For Bun runtime, we still use tfjs-node as it's compatible
    const tf = await import('@tensorflow/tfjs-node');

    // Load the TensorFlow.js model
    const modelPath = path.join(process.cwd(), 'public', 'tfjs_graphmodel', 'model.json');
    model = await tf.loadGraphModel(`file://${modelPath}`);
    console.log('✅ Model loaded successfully on server');
    return model;
  } catch (error) {
    console.error('❌ Failed to load model:', error);
    throw new Error('Model loading failed');
  }
}

// Preprocess image from file path
async function preprocessImage(imagePath: string): Promise<unknown> {
  try {
    // Dynamically import TensorFlow.js for Node.js (compatible with Bun)
    const tf = await import('@tensorflow/tfjs-node');

    // Read image file as buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Decode image using TensorFlow
    let tensor = tf.node.decodeImage(imageBuffer, 3); // 3 channels (RGB)

    // Resize to 224x224
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);

    // Convert to float and normalize to [0, 1] using tf.scalar for compatibility
    tensor = tensor.toFloat().div(tf.scalar(255));

    // Add batch dimension
    tensor = tensor.expandDims(0);

    return tensor;
  } catch (error) {
    console.error('❌ Failed to preprocess image:', error);
    throw new Error('Image preprocessing failed');
  }
}

// Run prediction
export async function predictImage(imagePath: string): Promise<PredictionResult> {
  try {
    // Dynamically import TensorFlow.js for Node.js
    await import('@tensorflow/tfjs-node');

    // Load model
    const loadedModel = await loadModel();

    // Preprocess image
    const tensor = await preprocessImage(imagePath);

    // Run prediction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const predictions = (loadedModel as any).predict(tensor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const probabilities = await (predictions as any).data();

    // Get results
    const classes = ['Bleached', 'Healthy'];
    const maxProb = Math.max(probabilities[0], probabilities[1]);
    const predictedIndex = probabilities[0] > probabilities[1] ? 0 : 1;

    const result: PredictionResult = {
      predictedClass: classes[predictedIndex],
      confidence: maxProb * 100,
      probabilityBleached: probabilities[0] * 100,
      probabilityHealthy: probabilities[1] * 100,
    };

    // Cleanup tensors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tensor as any).dispose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (predictions as any).dispose();

    console.log('✅ Prediction completed:', result);
    return result;

  } catch (error) {
    console.error('❌ Prediction failed:', error);
    // Return placeholder result if prediction fails
    return {
      predictedClass: 'Pending',
      confidence: 0,
      probabilityBleached: 0,
      probabilityHealthy: 0,
    };
  }
}