// Import Express dan controller yang sesuai
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Rute untuk membuat pemesanan baru
router.post('/buat', bookingController.buatPemesanan);

// Rute untuk mendapatkan semua pemesanan
router.get('/', bookingController.dapatkanSemuaPemesanan);

// Rute untuk memperbarui pemesanan berdasarkan ID
router.put('/:id', bookingController.perbaruiPemesanan);

// Rute untuk menghapus pemesanan berdasarkan ID
router.delete('/:id', bookingController.hapusPemesanan);

// Ekspor router untuk digunakan di file lain
module.exports = router;
