# Bookshelf Project

Proyek ini berisi backend API Bookshelf (Node.js/Hapi), frontend sederhana, dan aset pengujian Postman.

## Struktur Folder 

```text
Bookshelf-Management-REST-API/
|- bookshelf-api/                                  # Folder utama aplikasi (backend + frontend)
|  |- src/
|  |- frontend/
|  |- package.json
|- BookshelfAPITestCollectionAndEnvironment/       # Collection + environment Postman
|- README.md
```

## Menjalankan Backend API

1. Masuk ke folder backend:
	`cd bookshelf-api`
2. Install dependency:
	`npm install`
3. Jalankan server:
	`npm run start`

## Menjalankan Frontend

1. Buka folder `bookshelf-api/frontend`.
2. Jalankan `index.html` langsung di browser atau pakai Live Server.

## Pengujian API

- File collection dan environment Postman disimpan di folder `BookshelfAPITestCollectionAndEnvironment`.
- Import kedua file tersebut ke Postman lalu jalankan request test.


