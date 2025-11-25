'use client';

import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

// Register custom Erfc operation (used by GELU activation)
// Erfc(x) = 1 - Erf(x)
if (typeof window !== 'undefined') {
  tf.registerOp('Erfc', (node: any) => {
    return tf.tidy(() => {
      const x = node.inputs[0] as tf.Tensor;
      // Erfc(x) = 1 - Erf(x)
      // Use tf.erf if available, otherwise approximate
      const erfValue = (tf as any).erf ? (tf as any).erf(x) : approximateErf(x);
      return tf.sub(1, erfValue);
    });
  });
}

// Approximation of Erf function using Abramowitz and Stegun formula
function approximateErf(x: tf.Tensor): tf.Tensor {
  return tf.tidy(() => {
    // Constants for approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Save the sign of x
    const sign = tf.sign(x);
    const absX = tf.abs(x);

    // A&S formula
    const t = tf.div(1.0, tf.add(1.0, tf.mul(p, absX)));
    const t2 = tf.square(t);
    const t3 = tf.mul(t2, t);
    const t4 = tf.square(t2);
    const t5 = tf.mul(t4, t);

    const poly = tf.add(
      tf.mul(a1, t),
      tf.add(
        tf.mul(a2, t2),
        tf.add(
          tf.mul(a3, t3),
          tf.add(tf.mul(a4, t4), tf.mul(a5, t5))
        )
      )
    );

    const expNegXSquared = tf.exp(tf.neg(tf.square(absX)));
    const erf = tf.mul(sign, tf.sub(1.0, tf.mul(poly, expNegXSquared)));

    return erf;
  });
}

interface PredictionResult {
  class: string;
  confidence: number;
  probabilities: {
    Bleached: number;
    Healthy: number;
  };
}

export default function CoralPredictPage() {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'sample'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample images dari folder public
  const sampleImages = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    src: `/coral-images/coral_image_${i + 1}.jpg`,
    name: `Coral Image ${i + 1}`
  }));

  // Load model saat component mount
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setModelLoading(true);
      setError(null);

      // Load GraphModel (SavedModel format)
      const loadedModel = await tf.loadGraphModel('/tfjs_graphmodel/model.json');
      setModel(loadedModel);

      console.log('✅ Model loaded successfully!');
      console.log('Model metadata:', loadedModel.modelSignature);

    } catch (err) {
      console.error('Error loading model:', err);
      setError('Failed to load model. Please refresh the page.');
    } finally {
      setModelLoading(false);
    }
  };

  // Preprocess gambar dari File
  const preprocessImage = async (file: File): Promise<tf.Tensor> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // Resize ke 224x224
          const canvas = document.createElement('canvas');
          canvas.width = 224;
          canvas.height = 224;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image
          ctx.drawImage(img, 0, 0, 224, 224);

          // Convert ke tensor dan normalize (0-1)
          const tensor = tf.browser.fromPixels(canvas)
            .toFloat()
            .div(255.0)
            .expandDims(0); // Add batch dimension

          resolve(tensor);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  // Preprocess gambar dari URL
  const preprocessImageFromUrl = async (imageUrl: string): Promise<tf.Tensor> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Resize ke 224x224
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw image
        ctx.drawImage(img, 0, 0, 224, 224);

        // Convert ke tensor dan normalize (0-1)
        const tensor = tf.browser.fromPixels(canvas)
          .toFloat()
          .div(255.0)
          .expandDims(0); // Add batch dimension

        resolve(tensor);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image from URL'));
      };

      img.src = imageUrl;
    });
  };

  // Predict
  const handlePredict = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !model) return;

    try {
      setLoading(true);
      setError(null);
      setPrediction(null);

      const file = e.target.files[0];

      // Set image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Preprocess
      const tensor = await preprocessImage(file);

      // Predict with GraphModel
      const predictions = model.predict(tensor) as tf.Tensor;
      const probabilities = await predictions.data();

      const classes = ['Bleached', 'Healthy'];
      const maxProb = Math.max(...probabilities);
      const predictedIndex = Array.from(probabilities).indexOf(maxProb);

      const predictionResult = {
        class: classes[predictedIndex],
        confidence: maxProb * 100,
        probabilities: {
          Bleached: probabilities[0] * 100,
          Healthy: probabilities[1] * 100
        }
      };

      setPrediction(predictionResult);

      // Save to database
      await savePredictionToDb(file.name, undefined, predictionResult);

      // Cleanup tensors
      tensor.dispose();
      predictions.dispose();

    } catch (err) {
      console.error('Error during prediction:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetPrediction = () => {
    setPrediction(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save prediction to database
  const savePredictionToDb = async (
    imageName: string,
    imageUrl: string | undefined,
    predictionResult: PredictionResult
  ) => {
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageName,
          imageUrl,
          predictedClass: predictionResult.class,
          confidence: predictionResult.confidence,
          probabilityBleached: predictionResult.probabilities.Bleached,
          probabilityHealthy: predictionResult.probabilities.Healthy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prediction');
      }

      const data = await response.json();
      console.log('✅ Prediction saved to database:', data);
    } catch (err) {
      console.error('Error saving to database:', err);
      // Don't show error to user, just log it
    }
  };

  // Handle sample image selection
  const handleSampleImageClick = async (imageUrl: string) => {
    if (!model || loading) return;

    try {
      setLoading(true);
      setError(null);
      setPrediction(null);
      setImagePreview(imageUrl);

      // Preprocess dari URL
      const tensor = await preprocessImageFromUrl(imageUrl);

      // Predict with GraphModel
      const predictions = model.predict(tensor) as tf.Tensor;
      const probabilities = await predictions.data();

      const classes = ['Bleached', 'Healthy'];
      const maxProb = Math.max(...probabilities);
      const predictedIndex = Array.from(probabilities).indexOf(maxProb);

      const predictionResult = {
        class: classes[predictedIndex],
        confidence: maxProb * 100,
        probabilities: {
          Bleached: probabilities[0] * 100,
          Healthy: probabilities[1] * 100
        }
      };

      setPrediction(predictionResult);

      // Save to database
      const imageName = imageUrl.split('/').pop() || 'sample_image';
      await savePredictionToDb(imageName, imageUrl, predictionResult);

      // Cleanup tensors
      tensor.dispose();
      predictions.dispose();

    } catch (err) {
      console.error('Error during prediction:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Coral Reef Health Prediction
          </h1>
          <p className="text-gray-600">
            Upload an image to classify coral reef as Healthy or Bleached
          </p>
        </div>

        {/* Model Status */}
        <div className="mb-6 text-center">
          {modelLoading ? (
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
              <div className="w-4 h-4 border-2 border-yellow-800 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading AI Model...</span>
            </div>
          ) : model ? (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Model Ready</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              <span>Model Failed to Load</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => {
              setActiveTab('upload');
              resetPrediction();
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => {
              setActiveTab('sample');
              resetPrediction();
            }}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              activeTab === 'sample'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Use Sample Images
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Upload Section */}
          {activeTab === 'upload' && (
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePredict}
                disabled={!model || loading}
                className="hidden"
              />

              <button
                onClick={handleButtonClick}
                disabled={!model || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  'Choose Image to Predict'
                )}
              </button>
            </div>
          )}

          {/* Sample Images Gallery */}
          {activeTab === 'sample' && !imagePreview && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Select a Sample Coral Image
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {sampleImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => handleSampleImageClick(img.src)}
                    disabled={!model || loading}
                    className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105"
                  >
                    <img
                      src={img.src}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                        {img.id}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Preview and Results */}
          {imagePreview && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  Input Image
                </h3>
                <div className="border-4 border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Uploaded coral"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Prediction Result */}
              {prediction && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Prediction Result
                  </h3>

                  {/* Main Prediction */}
                  <div
                    className={`p-6 rounded-xl text-center ${
                      prediction.class === 'Healthy'
                        ? 'bg-green-100 border-2 border-green-300'
                        : 'bg-orange-100 border-2 border-orange-300'
                    }`}
                  >
                    <div className="text-3xl font-bold mb-2">
                      {prediction.class === 'Healthy' ? '🌊' : '⚠️'}
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        prediction.class === 'Healthy'
                          ? 'text-green-700'
                          : 'text-orange-700'
                      }`}
                    >
                      {prediction.class}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Confidence: {prediction.confidence.toFixed(2)}%
                    </div>
                  </div>

                  {/* Probability Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Bleached</span>
                        <span className="text-gray-600">
                          {prediction.probabilities.Bleached.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${prediction.probabilities.Bleached}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Healthy</span>
                        <span className="text-gray-600">
                          {prediction.probabilities.Healthy.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${prediction.probabilities.Healthy}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetPrediction}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Try Another Image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          {!imagePreview && activeTab === 'upload' && (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg">
                Upload a coral reef image to get started
              </p>
              <p className="text-sm mt-2">
                Supported formats: JPG, PNG, WebP
              </p>
            </div>
          )}
        </div>

        {/* Model Info */}
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-700 mb-2">
            About this Model
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Model: Vision Transformer (ViT) Lite</li>
            <li>• Input Size: 224x224 pixels</li>
            <li>• Classes: Bleached, Healthy</li>
            <li>• Test Accuracy: 98.83%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
