# Docker Setup untuk Website Neuro Bun

Dokumentasi ini menjelaskan cara menjalankan aplikasi Next.js dengan Bun menggunakan Docker.

## Prerequisites

- Docker Desktop atau Docker Engine (versi 20.10+)
- Docker Compose (versi 2.0+)

## Quick Start

### Production Mode

Untuk menjalankan aplikasi dalam mode production:

```bash
# Build dan jalankan container
docker-compose up -d

# Atau build manual
docker build -t website-neuro-bun .
docker run -p 3000:3000 website-neuro-bun
```

Aplikasi akan berjalan di `http://localhost:3000`

### Development Mode

Untuk menjalankan aplikasi dalam mode development dengan hot reload:

```bash
# Install dependencies terlebih dahulu (jika belum)
bun install

# Jalankan container development
docker-compose --profile dev up web-dev
```

## Commands

### Build Image

```bash
# Build production image
docker-compose build

# Build dengan no-cache
docker-compose build --no-cache
```

### Menjalankan Container

```bash
# Production mode (background)
docker-compose up -d

# Production mode (dengan logs)
docker-compose up

# Development mode
docker-compose --profile dev up web-dev
```

### Menghentikan Container

```bash
# Stop containers
docker-compose down

# Stop dan hapus volumes
docker-compose down -v
```

### Melihat Logs

```bash
# Semua logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Logs untuk service tertentu
docker-compose logs -f web
```

### Mengakses Container

```bash
# Masuk ke container yang sedang berjalan
docker-compose exec web sh

# Untuk development
docker-compose exec web-dev sh
```

## Environment Variables

Jika diperlukan environment variables, buat file `.env` di root project:

```env
# .env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
# Tambahkan environment variables lainnya
```

Kemudian update `docker-compose.yml`:

```yaml
services:
  web:
    env_file:
      - .env
```

## Optimizations

### Multi-stage Build

Dockerfile menggunakan multi-stage build untuk:
- Mengurangi ukuran image final
- Memisahkan dependencies development dan production
- Meningkatkan keamanan dengan menggunakan non-root user

### Standalone Output

Next.js dikonfigurasi dengan `output: 'standalone'` untuk menghasilkan output yang optimal untuk deployment.

## Troubleshooting

### Port sudah digunakan

Jika port 3000 sudah digunakan, edit `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Gunakan port 3001 di host
```

### Permission Issues

Jika ada masalah permission:

```bash
# Rebuild dengan no-cache
docker-compose build --no-cache

# Atau reset semua
docker-compose down -v
docker system prune -a
```

### Memory Issues

Jika build gagal karena memory, tambahkan resource limits:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          memory: 2G
```

## Production Deployment

Untuk deployment production di server:

```bash
# 1. Clone repository
git clone <repository-url>
cd website-neuro-bun

# 2. Build image
docker-compose build

# 3. Jalankan dalam detached mode
docker-compose up -d

# 4. Verify
docker-compose ps
docker-compose logs -f
```

### Dengan Auto-restart

Container sudah dikonfigurasi dengan `restart: unless-stopped` sehingga akan otomatis restart jika crash atau server reboot.

## Tips

1. **Caching**: Docker akan cache layers, jadi perubahan pada kode tidak akan rebuild dependencies
2. **Ukuran Image**: Production image menggunakan standalone output untuk ukuran minimal
3. **Security**: Container berjalan dengan non-root user (nextjs:nodejs)
4. **Logs**: Gunakan `docker-compose logs -f` untuk monitoring real-time

## References

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Bun Docker Images](https://hub.docker.com/r/oven/bun)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
