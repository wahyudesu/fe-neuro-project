#!/usr/bin/env python3
"""
Convert Keras model to SavedModel format, then to TensorFlow.js GraphModel
"""
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflowjs as tfjs
from tensorflow import keras
from tensorflow.keras import layers
import tensorflow as tf

# Define PatchEncoder custom layer
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

print("🔄 Loading Keras model...")

# Load model with custom layer
model = keras.models.load_model(
    'model/coral_vit_lite_best.keras',
    custom_objects={"PatchEncoder": PatchEncoder}
)

print("✅ Model loaded!")
print(f"   Input shape: {model.input_shape}")
print(f"   Output shape: {model.output_shape}")

# Save as SavedModel first (Keras 3 uses export)
savedmodel_path = 'model/saved_model'
print(f"\n🔄 Exporting as SavedModel to {savedmodel_path}...")
model.export(savedmodel_path)
print("✅ SavedModel exported!")

# Convert SavedModel to TensorFlow.js GraphModel
output_dir = 'public/tfjs_graphmodel'
print(f"\n🔄 Converting SavedModel to TensorFlow.js GraphModel...")
print(f"   Output: {output_dir}/")

# Skip optimization due to unsupported Erfc op
tfjs.converters.convert_tf_saved_model(
    savedmodel_path,
    output_dir,
    skip_op_check=True,
    strip_debug_ops=False
)

print("\n✅ Konversi berhasil!")
print("\n📁 File yang dihasilkan:")
for file in sorted(os.listdir(output_dir)):
    file_path = os.path.join(output_dir, file)
    size = os.path.getsize(file_path) / (1024 * 1024)
    print(f"   - {file} ({size:.2f} MB)")

print("\n🎉 GraphModel siap digunakan di Next.js!")
print("   Load dengan: tf.loadGraphModel('/tfjs_graphmodel/model.json')")
