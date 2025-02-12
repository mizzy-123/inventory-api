# Inventory Api

Digunakan untuk mengelola gudang.

## Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan proyek ini di lokal Anda.

### Langkah 1: Instalasi Dependensi

Menggunakan `yarn`:

```bash
yarn install
```

Atau menggunakan `npm`:

```bash
npm install
```

### Langkah 2: Konfigurasi .env

Salin file `.env.example` dan ubah namanya menjadi `.env`:

```bash
cp .env.example .env
```

Kemudian ubah konfigurasi connection prismanya di .env, disini saya menggunakan database PostgreSQL

### Langkah 3: Menjalankan Aplikasi

Mode Development

Menggunakan `yarn`:

```bash
yarn dev
```

Atau menggunakan `npm`:

```bash
npm run dev
```

Mode Production

Menggunakan `yarn`:

```bash
yarn build
```

Atau menggunakan `npm`:

```bash
npm run build
```

Kemudian, jalankan aplikasi:

Menggunakan `yarn`:

```bash
yarn prod
```

Atau menggunakan `npm`:

```bash
npm run prod
```

### How to Setup PRISMA

Migrate database

```bash
npx prisma migrate dev --name init
```

Seed database

```bash
npx prisma db seed
```

### Link Documentaion

[Link Here](https://documenter.getpostman.com/view/27154881/2sA3kUFMWQ)
