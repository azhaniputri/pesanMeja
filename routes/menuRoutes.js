// Import Express dan controller yang sesuai
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Rute untuk menambahkan menu baru
router.post('/tambah', menuController.tambahMenu);

// Rute untuk mendapatkan semua menu
router.get('/', menuController.dapatkanSemuaMenu);

// Rute untuk memperbarui menu berdasarkan ID
router.put('/:id', menuController.perbaruiMenu);

// Rute untuk menghapus menu berdasarkan ID
router.delete('/:id', menuController.hapusMenu);

// Ekspor router untuk digunakan di file lain
module.exports = router;
