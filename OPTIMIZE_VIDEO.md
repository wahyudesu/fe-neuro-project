# 🚀 Panduan Optimasi Video untuk Website

Video Anda saat ini: **8.7MB** - ini cukup berat untuk website.
Target optimal untuk background video: **2-4MB**

---

## 🎯 Solusi Optimasi

### ✅ Sudah Diimplementasikan di Code:

1. **`preload="metadata"`** - Hanya load metadata dulu, bukan full video
2. **`poster="/poster.jpg"`** - Tampilkan gambar placeholder saat loading
3. **Fallback gradient** - Jika video gagal load

---

## 🔧 Cara 1: Compress Video dengan FFmpeg (RECOMMENDED)

### Install FFmpeg:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download dari: https://ffmpeg.org/download.html

---

### 🎬 Script Compress Video

Jalankan command ini di terminal dari folder project:

#### Option 1: Compress Standard (Recommended - ~70% lebih kecil)
```bash
ffmpeg -i public/video.mp4 \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=1920:-2" \
  -movflags +faststart \
  -an \
  public/video-optimized.mp4
```

**Hasil:** Video ~2-3MB, kualitas masih bagus

---

#### Option 2: Compress Aggressive (~80% lebih kecil)
```bash
ffmpeg -i public/video.mp4 \
  -vcodec libx264 \
  -crf 32 \
  -preset slow \
  -vf "scale=1280:-2" \
  -movflags +faststart \
  -an \
  public/video-compressed.mp4
```

**Hasil:** Video ~1-2MB, kualitas OK untuk background

---

#### Option 3: WebM Format (Modern & Efisien)
```bash
ffmpeg -i public/video.mp4 \
  -c:v libvpx-vp9 \
  -crf 35 \
  -b:v 0 \
  -vf "scale=1920:-2" \
  -an \
  public/video.webm
```

**Hasil:** Video WebM ~1.5-2.5MB, sangat efisien

---

### 📊 Penjelasan Parameter:

- `-crf 28` = Quality (18=best, 35=compressed) - **28 recommended**
- `-preset slow` = Compression speed (slow = better quality)
- `-vf "scale=1920:-2"` = Resize ke 1920px width (Full HD)
- `-movflags +faststart` = Optimize untuk web streaming
- `-an` = Remove audio (tidak perlu untuk background video)

---

## 🖼️ Cara 2: Buat Poster Image (Placeholder)

Extract frame pertama dari video sebagai poster:

```bash
ffmpeg -i public/video.mp4 -ss 00:00:01 -vframes 1 public/poster.jpg
```

Atau compress poster image:
```bash
ffmpeg -i public/poster.jpg -q:v 5 public/poster-optimized.jpg
```

**Ukuran target poster:** 100-300KB

---

## 📱 Cara 3: Conditional Loading (Mobile vs Desktop)

Update `app/page.tsx` untuk skip video di mobile:

```tsx
'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Video hanya di desktop */}
      {!isMobile ? (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/poster.jpg"
            className="w-full h-full object-cover opacity-70"
          >
            <source src="/video-optimized.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-transparent to-blue-950/50"></div>
        </div>
      ) : (
        // Fallback gradient untuk mobile (no video)
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950"></div>
      )}

      {/* Rest of content... */}
    </div>
  )
}
```

---

## 🎯 Cara 4: Multiple Video Sources (Best Practice)

Provide multiple formats untuk browser compatibility:

```tsx
<video ...>
  <source src="/video.webm" type="video/webm" />
  <source src="/video.mp4" type="video/mp4" />
</video>
```

Browser akan pilih format yang paling efisien.

---

## ⚡ Cara 5: Lazy Loading Video

Video hanya load ketika user scroll ke area tersebut:

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldPlay, setShouldPlay] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPlay(true)
        }
      },
      { threshold: 0.25 }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <video ref={videoRef} autoPlay={shouldPlay} ...>
  )
}
```

---

## 📋 Checklist Optimasi

Implementasikan langkah-langkah ini secara berurutan:

### Quick Wins (Sudah Implemented):
- [x] `preload="metadata"` ✅
- [x] `poster` attribute ✅
- [ ] Buat poster.jpg dari video

### Medium Effort (Recommended):
- [ ] Compress video dengan FFmpeg (crf 28)
- [ ] Generate WebM version
- [ ] Replace video.mp4 dengan video-optimized.mp4

### Advanced (Opsional):
- [ ] Conditional loading untuk mobile
- [ ] Multiple video sources (WebM + MP4)
- [ ] Lazy loading dengan Intersection Observer

---

## 🎬 Step-by-Step: Compress Video Sekarang

1. **Install FFmpeg** (jika belum):
   ```bash
   # Ubuntu/Debian
   sudo apt install ffmpeg

   # macOS
   brew install ffmpeg
   ```

2. **Compress Video**:
   ```bash
   cd /home/why/Workspace/website-neuro-bun

   # Compress ke ~2-3MB (recommended)
   ffmpeg -i public/video.mp4 \
     -vcodec libx264 \
     -crf 28 \
     -preset slow \
     -vf "scale=1920:-2" \
     -movflags +faststart \
     -an \
     public/video-optimized.mp4
   ```

3. **Generate Poster**:
   ```bash
   ffmpeg -i public/video.mp4 -ss 00:00:01 -vframes 1 -q:v 5 public/poster.jpg
   ```

4. **Update Code** di `app/page.tsx` baris 22:
   ```tsx
   <source src="/video-optimized.mp4" type="video/mp4" />
   ```

5. **Test** - Reload browser dan cek performa!

---

## 📊 Expected Results

**Before:**
- Video size: 8.7MB
- Load time: 3-5 seconds (slow connection)
- First paint: delayed

**After (dengan compress crf 28):**
- Video size: ~2-3MB (70% reduction)
- Load time: 1-2 seconds
- First paint: immediate (poster shows first)

**After (dengan compress crf 32 + WebM):**
- Video size: ~1-2MB (80% reduction)
- Load time: <1 second
- First paint: instant

---

## 🔍 Check File Size After Compression

```bash
ls -lh public/*.mp4
ls -lh public/*.webm
ls -lh public/*.jpg
```

---

## 💡 Pro Tips

1. **CRF Sweet Spot**: Gunakan `crf 28` untuk balance kualitas vs size
2. **Remove Audio**: Background video tidak perlu audio (`-an` flag)
3. **Scale Down**: 1920px width sudah cukup, tidak perlu 4K
4. **WebM Format**: 20-30% lebih kecil dari MP4 dengan kualitas sama
5. **Poster Image**: Compress dengan `q:v 5` untuk 100-300KB
6. **Mobile First**: Pertimbangkan skip video di mobile device
7. **CDN**: Untuk production, host video di CDN (Cloudflare, Vercel)

---

## 🚨 Quick Fix (Tanpa FFmpeg)

Jika tidak bisa install FFmpeg, gunakan online tools:

1. **CloudConvert**: https://cloudconvert.com/mp4-converter
   - Upload video.mp4
   - Set quality ke 70-80%
   - Set resolution ke 1920x1080
   - Remove audio

2. **Online Video Compressor**: https://www.videosmaller.com/
   - Upload video
   - Use low compression level

3. **HandBrake** (GUI App): https://handbrake.fr/
   - Download & install
   - Load video.mp4
   - Preset: "Web" → "Gmail Large 3 Minutes 720p30"
   - Export

---

Selamat mengoptimasi! 🚀

**Recommendation:** Mulai dengan FFmpeg compression (crf 28) - ini yang paling mudah dan efektif!
