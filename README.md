# EkoGeri - Geri Dönüşüm Sistemi

Kullanıcıların geri dönüştürülebilir atık bırakarak Eko-Puanı kazandığı ve ödül redeem edebildiği topluluk tabanlı bir geri dönüşüm platformu.

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.2, Java 21, JWT |
| Veritabanı | PostgreSQL 16, Flyway |
| Altyapı | Docker, Docker Compose |

## Çalıştırma

```bash
docker compose up --build
```

| Servis | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5433 |

## Sayfalar

- `/dashboard` — Kullanıcı paneli
- `/deposit` — QR kod ile atık bırakma
- `/map` — Yakındaki geri dönüşüm konteynerleri
- `/leaderboard` — Sıralama
- `/rewards` — Eko-Puanı ile ödül alma
- `/admin` — Yönetici paneli
- `/municipality` — Belediye yönetimi
