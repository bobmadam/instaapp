
---

# 📸 InstaApp  
### _A Simple Instagram-like Social Media Application_

InstaApp adalah aplikasi mini media sosial yang terinspirasi dari Instagram.  
Dibangun menggunakan **PHP (Yii2)** untuk backend API dan **HTML/CSS/JavaScript (Bootstrap 5)** untuk frontend.

Aplikasi ini mendemonstrasikan fitur dasar platform sosial seperti:
- 🔐 Register & Login (JWT Authentication)
- 🖼️ Upload Post (gambar + caption)
- ❤️ Like / Unlike Post
- 💬 Komentar pada Post
- ❌ Hak akses: hanya pemilik yang dapat menghapus post atau komentar

---
## ⚙️ Persiapan Awal

Pastikan sudah terinstal:
- PHP 8.0+
- Composer
- PostgreSQL

---

## 🚀 Cara Menjalankan Project

### 1️⃣ Clone Project

```bash
git clone https://github.com/bobmadam/instaapp.git
cd instaapp
````

---

### 2️⃣ Install Dependency Composer

```bash
composer install
```

---

### 3️⃣ Import Database PostgreSQL

Buat database baru di PostgreSQL, misalnya:

```sql
CREATE DATABASE instaapp;
```

Kemudian, jalankan salah satu dari dua cara berikut:

#### 🧩 Opsi 1 — Import via terminal:

```bash
psql -U <postgres_user> -d instaapp -f ../table_instaapp.sql
```

#### 🧩 Opsi 2 — Import manual:

Buka file `table_instaapp.sql`,
lalu **copy seluruh isi SQL** dan jalankan di **Query Tool / SQL Editor** PostgreSQL Anda
(misal di **pgAdmin**, **Navicat**, atau **DBeaver**).

---

### 4️⃣ Copy File `.env`

Masih di folder `instaapp`, salin file contoh environment:

```bash
cp .env.example .env
```

---

### 5️⃣ Ubah Konfigurasi Database

Edit file `config/db.php` sesuai dengan database lokal Anda, contoh:

```php
return [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:host=127.0.0.1;dbname=instaapp',
    'username' => 'postgres',
    'password' => 'postgres',
    'charset' => 'utf8',
];
```

---

### 6️⃣ Jalankan Backend (API)

Masih di folder `instaapp`, jalankan server Yii:

```bash
php yii serve --port=8000
```

Backend akan berjalan di:
👉 **[http://localhost:8000/api](http://localhost:8000/api)**

---

### 7️⃣ Jalankan Frontend

Kembali ke root project (`instaapp/`) lalu jalankan frontend dengan beda terminal`:

```bash
php -S localhost:5500 -t frontend
```

Frontend akan berjalan di:
👉 **[http://localhost:5500/login.html](http://localhost:5500/login.html)**

---

## ✅ Alur Testing

1. Buka `http://localhost:5500/login.html`
2. Register akun baru
3. Login menggunakan akun tersebut
4. Upload post dengan gambar dan caption
5. Lihat feed utama (`index.html`)
6. Coba like dan komentar
7. Logout jika sudah selesai

---

## 🎉 Selesai

Setelah semua langkah di atas dilakukan:

* Backend → [http://localhost:8000](http://localhost:8000)
* Frontend → [http://localhost:5500/login.html](http://localhost:5500/login.html)

Aplikasi siap digunakan ✅