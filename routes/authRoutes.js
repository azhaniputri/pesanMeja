const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Model User

// Route untuk registrasi
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna baru
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registrasi berhasil!' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
});
// Route untuk login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Cari pengguna berdasarkan email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).render('login', { errorMessage: 'Pengguna tidak ditemukan' });
      }
  
      // Periksa kecocokan password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).render('login', { errorMessage: 'Password salah' });
      }
  
      // Buat token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Simpan token ke cookie
      res.cookie('token', token, { httpOnly: true });
  
      // Setelah login berhasil, langsung redirect ke index.html
      res.redirect('/index');  // Pastikan ini sesuai dengan rute halaman utama Anda
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
  });
  
  module.exports = router;
  
  