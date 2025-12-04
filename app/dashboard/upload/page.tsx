'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith('image/')
    )

    setSelectedFiles((prev) => [...prev, ...imageFiles])

    // Create previews
    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    // Upload each file to the server (base64 approach)
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const previewBase64 = previews[i]
        if (!previewBase64) continue

        // Optional: enforce size limit (10MB)
        const MAX_SIZE = 10 * 1024 * 1024
        if (file.size > MAX_SIZE) {
          alert(`${file.name} terlalu besar (maks 10MB)`)
          continue
        }

        const payload = {
          imageName: file.name,
          imageBase64: previewBase64,
          predictedClass: 'Pending',
          confidence: 0,
          probabilityBleached: 0,
          probabilityHealthy: 0,
        }

        const res = await fetch('/api/predictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!json?.success) {
          console.error('Upload failed for', file.name, json)
          alert(`Upload failed for ${file.name}: ${json?.error ?? 'Unknown error'}`)
        }
      }
    } catch (err) {
      console.error('Error uploading files:', err)
      alert('Terjadi kesalahan saat mengupload.')
    }
  setIsUploading(false)

    // Show success message
    alert(`${selectedFiles.length} gambar berhasil diupload!`)

    // Clear files
    setSelectedFiles([])
    setPreviews([])
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-2 m-0">
          Upload Gambar
        </h1>
        <p className="text-slate-600 text-lg m-0">
          Unggah gambar untuk analisis AI
        </p>
      </header>

      {/* Upload Area */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg mb-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center
            transition-all duration-300 cursor-pointer
            ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-6xl mb-4">📤</div>
          <h3 className="text-xl font-bold text-[#001f3f] mb-2 m-0">
            Drag & Drop atau Klik untuk Upload
          </h3>
          <p className="text-slate-500 mb-4 m-0">
            Mendukung format: JPG, PNG, GIF (Maks. 10MB per file)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            className="px-6 py-3 bg-[#001f3f] text-white rounded-xl font-medium transition-all duration-300 hover:bg-[#003d5c] hover:-translate-y-1 hover:shadow-lg"
          >
            Pilih File
          </button>
        </div>
      </div>

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#001f3f] m-0">
              File Terpilih ({selectedFiles.length})
            </h3>
            <button
              onClick={() => {
                setSelectedFiles([])
                setPreviews([])
              }}
              className="text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Hapus Semua
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1 rounded truncate">
                  {selectedFiles[index].name}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`
                px-8 py-4 rounded-xl font-semibold text-lg
                transition-all duration-300
                ${
                  isUploading
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white hover:-translate-y-1 hover:shadow-lg'
                }
              `}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Mengupload...
                </span>
              ) : (
                <span>Upload {selectedFiles.length} Gambar</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
        <div className="flex gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h4 className="font-bold text-[#001f3f] mb-2 m-0">Tips Upload</h4>
            <ul className="text-sm text-slate-600 space-y-1 m-0 pl-5">
              <li>Pastikan gambar memiliki kualitas yang baik untuk hasil analisis optimal</li>
              <li>Gambar dengan pencahayaan yang cukup akan memberikan hasil yang lebih akurat</li>
              <li>Anda dapat mengupload multiple gambar sekaligus</li>
              <li>Format yang disarankan: JPG atau PNG</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
