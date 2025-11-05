---

````markdown
# 📸 InstaApp — Mini Social Media App

Aplikasi mini seperti Instagram untuk latihan dan demo tes teknikal.

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
git clone https://github.com/<username>/instaapp.git
cd instaapp
````

---

### 2️⃣ Install Dependency Composer

Masuk ke folder backend:

```bash
cd instaapp-api
composer install
```

---

### 3️⃣ Import Database PostgreSQL

Buat database baru di PostgreSQL, misal:

```sql
CREATE DATABASE instaapp;
```

Lalu jalankan perintah berikut dari terminal (sesuaikan username PostgreSQL):

```bash
psql -U <postgres_user> -d instaapp -f ../table_instaapp.sql
```

Atau copy yang ada di dalam file table_instaapp.sql lalu dijalankan pada query tool (pgaadmin/navicat/dbeaver)

---

### 4️⃣ Copy File `.env`

Masih di folder `instaapp-api`, salin file contoh environment:

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

Masih di folder `instaapp-api`, jalankan server Yii:

```bash
php yii serve --port=8000
```

Backend akan berjalan di:
👉 **[http://localhost:8000/api](http://localhost:8000/api)**

---

### 7️⃣ Jalankan Frontend

Kembali ke root project (`instaapp/`) lalu jalankan frontend:

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