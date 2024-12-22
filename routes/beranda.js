const express = require('express');
const router = express.Router();

// Rute untuk mendapatkan semua pemesanan tiket (GET)
router.get('/', async (req, res) => {
    res.render('beranda')
});

module.exports = router;