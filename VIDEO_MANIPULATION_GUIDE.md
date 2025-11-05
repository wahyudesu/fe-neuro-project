# 📹 Panduan Manipulasi Video Background

Panduan lengkap untuk memanipulasi video background di website Anda menggunakan CSS.

## 🎨 1. Transparansi Video

### Opacity (Transparansi)
```tsx
<video className="opacity-70">  // 70% visible, 30% transparent
```

**Nilai opacity:**
- `opacity-0` = 0% (invisible)
- `opacity-25` = 25%
- `opacity-50` = 50%
- `opacity-70` = 70% (recommended untuk background)
- `opacity-100` = 100% (full visible)

---

## 🎭 2. CSS Filters untuk Manipulasi Visual

### Brightness (Kecerahan)
```tsx
<video style={{ filter: 'brightness(0.8)' }}>
```
- `brightness(0.5)` = 50% lebih gelap
- `brightness(1)` = normal
- `brightness(1.5)` = 50% lebih terang

### Contrast (Kontras)
```tsx
<video style={{ filter: 'contrast(1.2)' }}>
```
- `contrast(0.5)` = kontras rendah
- `contrast(1)` = normal
- `contrast(1.5)` = kontras tinggi

### Saturate (Saturasi Warna)
```tsx
<video style={{ filter: 'saturate(1.3)' }}>
```
- `saturate(0)` = grayscale
- `saturate(1)` = normal
- `saturate(2)` = warna sangat jenuh

### Blur (Kabur)
```tsx
<video style={{ filter: 'blur(4px)' }}>
```
- `blur(0px)` = tidak blur
- `blur(5px)` = sedikit blur
- `blur(10px)` = sangat blur

### Grayscale (Hitam Putih)
```tsx
<video style={{ filter: 'grayscale(100%)' }}>
```
- `grayscale(0%)` = full color
- `grayscale(50%)` = setengah grayscale
- `grayscale(100%)` = full hitam putih

### Hue Rotate (Ubah Warna)
```tsx
<video style={{ filter: 'hue-rotate(90deg)' }}>
```
- `hue-rotate(0deg)` = warna asli
- `hue-rotate(90deg)` = shift hijau
- `hue-rotate(180deg)` = warna terbalik

### Sepia (Efek Vintage)
```tsx
<video style={{ filter: 'sepia(80%)' }}>
```
- `sepia(0%)` = no effect
- `sepia(100%)` = full sepia/vintage

---

## 🎯 3. Kombinasi Multiple Filters

Anda bisa gabungkan beberapa filter sekaligus:

```tsx
<video
  style={{
    filter: 'brightness(0.8) contrast(1.2) saturate(1.3) blur(2px)'
  }}
>
```

**Contoh Preset:**

### Ocean Theme (Tema Laut)
```tsx
style={{ filter: 'brightness(0.7) saturate(1.5) hue-rotate(200deg)' }}
```

### Vintage/Retro
```tsx
style={{ filter: 'sepia(60%) contrast(0.9) brightness(1.1)' }}
```

### Dramatic Dark
```tsx
style={{ filter: 'brightness(0.5) contrast(1.3) saturate(0.8)' }}
```

### Soft Dreamy
```tsx
style={{ filter: 'brightness(1.1) blur(3px) saturate(1.2)' }}
```

---

## 📐 4. Object Fit (Cara Video Ditampilkan)

### Object Cover (Default - Recommended)
```tsx
<video className="object-cover">
```
Video menutupi seluruh area, bisa terpotong tapi tidak ada black bars.

### Object Contain
```tsx
<video className="object-contain">
```
Video ditampilkan sepenuhnya, mungkin ada black bars.

### Object Fill
```tsx
<video className="object-fill">
```
Video di-stretch untuk menutupi area (bisa distorsi).

---

## 🌈 5. Overlay Gradients

### Gradient Overlay Gelap
```tsx
<div className="absolute inset-0 bg-black/40"></div>
```

### Gradient dari Atas ke Bawah
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
```

### Gradient Multi-Color
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30"></div>
```

### Gradient Radial (Tengah Terang)
```tsx
<div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_40%,_rgba(0,0,0,0.6)_100%)]"></div>
```

---

## ⚡ 6. Blend Modes (Mix Blend Mode)

```tsx
<video className="mix-blend-overlay">
```

**Mode options:**
- `mix-blend-multiply` = darken
- `mix-blend-screen` = lighten
- `mix-blend-overlay` = contrast
- `mix-blend-soft-light` = subtle
- `mix-blend-color-dodge` = bright glow

---

## 🎬 7. Video Speed Control

### Slow Motion
```tsx
<video playbackRate={0.5}>  // 50% speed
```

### Fast Forward
```tsx
<video playbackRate={2}>  // 200% speed
```

**Note:** Perlu JavaScript untuk control playbackRate:

```tsx
'use client'
import { useRef, useEffect } from 'react'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75  // 75% speed (slow motion)
    }
  }, [])

  return (
    <video ref={videoRef} ...>
  )
}
```

---

## 🎯 8. Contoh Lengkap di page.tsx

### Lokasi: `app/page.tsx` baris 9-21

Untuk mengubah style video, edit bagian ini:

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-cover opacity-70"
  style={{
    // Uncomment dan edit filter di bawah:
    filter: 'brightness(0.8) contrast(1.1) saturate(1.2)'
  }}
>
  <source src="/video.mp4" type="video/mp4" />
</video>
```

**Contoh Manipulasi:**

```tsx
// Ocean Blue Effect
style={{ filter: 'brightness(0.7) saturate(1.5) hue-rotate(200deg)' }}

// Dramatic Dark
style={{ filter: 'brightness(0.6) contrast(1.4)' }}

// Soft Blur Background
style={{ filter: 'blur(5px) brightness(0.8)' }}

// Vintage Ocean
style={{ filter: 'sepia(40%) contrast(1.2) brightness(0.9)' }}
```

---

## 🔧 9. Tips & Best Practices

1. **Performance**: Jangan gunakan terlalu banyak filters sekaligus (max 3-4)
2. **Testing**: Test di berbagai browser (Chrome, Firefox, Safari)
3. **Mobile**: Video berat bisa lambat di mobile, pertimbangkan file size
4. **Accessibility**: Pastikan text tetap terbaca dengan contrast yang cukup
5. **Fallback**: Sediakan background color fallback jika video gagal load

---

## 🎨 10. Quick Presets (Copy & Paste)

### Preset 1: Ocean Deep
```tsx
className="opacity-60"
style={{ filter: 'brightness(0.7) saturate(1.6) hue-rotate(210deg) contrast(1.1)' }}
```

### Preset 2: Cinematic
```tsx
className="opacity-80"
style={{ filter: 'brightness(0.75) contrast(1.3) saturate(0.9)' }}
```

### Preset 3: Dreamy Soft
```tsx
className="opacity-50"
style={{ filter: 'brightness(1.2) blur(8px) saturate(1.4)' }}
```

### Preset 4: Night Mode
```tsx
className="opacity-40"
style={{ filter: 'brightness(0.4) contrast(1.5) saturate(0.7)' }}
```

### Preset 5: Vibrant
```tsx
className="opacity-85"
style={{ filter: 'brightness(1.1) saturate(2) contrast(1.2)' }}
```

---

## 📝 Cara Pakai

1. Buka file `app/page.tsx`
2. Cari baris dengan `<video>` element (sekitar baris 9-21)
3. Edit `className` untuk transparansi
4. Edit `style={{ filter: '...' }}` untuk efek visual
5. Save file dan lihat hasilnya di browser (auto hot-reload)

**Contoh:**
```tsx
// Dari:
className="w-full h-full object-cover opacity-70"
style={{
  // filter: 'brightness(0.8) contrast(1.1) saturate(1.2)'
}}

// Menjadi:
className="w-full h-full object-cover opacity-60"
style={{
  filter: 'brightness(0.7) saturate(1.6) contrast(1.2) hue-rotate(200deg)'
}}
```

---

Selamat bereksperimen! 🎉
