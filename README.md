# Bookshelf Project

Proyek ini berisi backend API Bookshelf (Node.js/Hapi), frontend sederhana, dan aset pengujian Postman.

## Struktur Folder (Final)

```text
Bookshelf-API/
|- bookshelf-api/                 # Folder utama aplikasi (backend + frontend)
|  |- src/
|  |- frontend/
|- postman-tests/                 # Folder testing terpisah
|- README.md
```

## Menjalankan Backend API

1. Masuk ke folder backend:
	`cd bookshelf-api`
2. Install dependency:
	`npm install`
3. Jalankan server:
	`npm run start`

Default server berjalan di `http://localhost:9000`.

## Menjalankan Frontend

1. Buka folder `bookshelf-api/frontend`.
2. Jalankan `index.html` langsung di browser atau pakai Live Server.

## Pengujian API

- Simpan/letakkan file collection dan environment Postman di folder `postman-tests`.
- Import kedua file tersebut ke Postman lalu jalankan request test.

## Catatan Rapikan Struktur

- Untuk push yang bersih ke GitHub, gunakan folder `bookshelf-api` sebagai folder utama aplikasi.
- Folder `postman-tests` tetap terpisah khusus untuk pengujian.
- Folder lama yang duplikat tetap di-ignore agar tidak ikut ter-push.
