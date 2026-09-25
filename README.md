# RuangKelas - Mini LMS Lengkap

Prototype frontend lengkap untuk Final Project Implementasi dan Pengujian Perangkat Lunak.

## Role
- Mahasiswa
- Dosen

## Fitur
### Mahasiswa
- Login
- Dashboard
- Melihat mata kuliah
- Melihat materi
- Melihat tugas
- Mengumpulkan tugas
- Melihat nilai dan feedback
- Melihat pengumuman
- Logout

### Dosen
- Login
- Dashboard
- Kelola mata kuliah (tambah/edit/hapus)
- Kelola materi (tambah/edit/hapus)
- Kelola tugas (tambah/edit/hapus)
- Kelola nilai
- Kelola pengumuman (tambah/edit/hapus)
- Logout

## Menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser.
3. Isi username/password bebas.
4. Pilih role Mahasiswa atau Dosen.

## Catatan penting
Versi ini adalah frontend/prototype yang menggunakan localStorage browser. Jadi data belum menjadi database bersama dan belum aman untuk deployment produksi.

Untuk versi final sesuai rencana kelompok:
Frontend -> Laravel Blade/HTML/CSS/JS
Backend -> Laravel/PHP (OOP)
Database -> MySQL
Authentication -> Laravel Auth
File upload -> storage/server
Testing -> Black-box + test case + bug report

Struktur data dan alur fitur sengaja dibuat agar mudah dipindahkan ke Laravel + MySQL.
