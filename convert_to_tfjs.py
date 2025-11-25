#!/usr/bin/env python3
"""
Script untuk konversi model Keras ke TensorFlow.js
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TF warnings

import tensorflowjs as tfjs
from tensorflow import keras
from tensorflow.keras import layers
import tensorflow as tf

# Define PatchEncoder custom layer (dari notebook)
class PatchEncoder(layers.Layer):
    def __init__(self, num_patches, projection_dim, **kwargs):
        super().__init__(**kwargs)
        self.num_patches = num_patches
        self.projection_dim = projection_dim
        self.projection = layers.Dense(projection_dim)
        self.position = layers.Embedding(input_dim=num_patches, output_dim=projection_dim)

    def call(self, patch):
        positions = tf.range(start=0, limit=self.num_patches, delta=1)
        encoded = self.projection(patch) + self.position(positions)
        return encoded

    def get_config(self):
        config = super().get_config()
        config.update({
            "num_patches": self.num_patches,
            "projection_dim": self.projection_dim
        })
        return config

print("🔄 Loading Keras model with custom layer...")

# Path ke model
model_path = 'model/coral_vit_lite_best.keras'

# Rebuild model structure
IMG_SIZE = 224
patch_size = 16
num_patches = (IMG_SIZE // patch_size) ** 2
projection_dim = 256
num_heads = 4
transformer_layers = 4

# Load model dengan custom layer
model = keras.models.load_model(
    model_path,
    custom_objects={"PatchEncoder": PatchEncoder}
)

print("✅ Model loaded successfully!")
print(f"   Input shape: {model.input_shape}")
print(f"   Output shape: {model.output_shape}")

# Output directory
output_dir = 'public/tfjs_model'
os.makedirs(output_dir, exist_ok=True)

print(f"\n🔄 Converting to TensorFlow.js format...")
print(f"   Output: {output_dir}/")

# Konversi ke TensorFlow.js
tfjs.converters.save_keras_model(model, output_dir)

print("\n✅ Konversi berhasil!")
print("\n📁 File yang dihasilkan:")
for file in sorted(os.listdir(output_dir)):
    file_path = os.path.join(output_dir, file)
    size = os.path.getsize(file_path) / (1024 * 1024)  # MB
    print(f"   - {file} ({size:.2f} MB)")

print("\n🎉 Model siap digunakan di Next.js!")
print("   Load dengan: tf.loadLayersModel('/tfjs_model/model.json')")
