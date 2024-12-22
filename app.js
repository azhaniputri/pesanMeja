// Import library yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const nodemailer = require('./config/emailConfig'); // Import konfigurasi Nodemailer

// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const Booking = require('./models/Booking');

// Inisialisasi dotenv untuk memuat variabel lingkungan dari .env
require('dotenv').config();

// Inisialisasi aplikasi express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware untuk parsing JSON dan mengaktifkan CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inisialisasi koneksi ke MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pesanmeja';
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Menyajikan file CSS dan file statis lainnya
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Rute untuk halaman statis
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

//Rute untuk Halaman Booking
app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'booking.html'));
});


// Rute untuk halaman beranda
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Rute untuk halaman beranda
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route untuk membuat pemesanan
app.post('/api/booking/buat', async (req, res) => {
  try {
    const { namaPengguna, email, tanggal, waktu, jumlahTamu, tipeMeja, catatan } = req.body;

    // Validasi input
    if (!namaPengguna || !email || !tanggal || !waktu || !jumlahTamu || !tipeMeja) {
      return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }

    // Membuat dokumen baru berdasarkan data yang diterima
    const newBooking = new Booking({
      namaPengguna,
      email,
      tanggal: new Date(tanggal),
      waktu,
      jumlahTamu,
      tipeMeja,
      catatan,
    });

    // Menyimpan pemesanan ke dalam database
    await newBooking.save();

    // Kirim email konfirmasi pemesanan
    await nodemailer.kirimEmail({
      namaPengguna,
      email,
      tanggal,
      waktu,
      jumlahTamu,
      tipeMeja,
      catatan,
      kodeTiket: buatKodeRandomTiket(),
    });

    // Mengirimkan respons jika pemesanan berhasil dibuat
    res.status(201).json({ message: 'Pemesanan berhasil dibuat!', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat pemesanan.' });
  }
});

function buatKodeRandomTiket() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

// Menggunakan routes untuk menu dan pemesanan
app.use('/api/menu', menuRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/auth', authRoutes);

// Menjalankan server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Chatbot logic
io.on('connection', (socket) => {
  console.log('User terhubung:', socket.id);

  socket.on('chatMessage', (message) => {
    const botReply = getBotReply(message);
    socket.emit('botReply', botReply);
  });

  socket.on('disconnect', () => {
    console.log('User terputus:', socket.id);
  });
});

function getBotReply(message) {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.includes('halo')) {
    return 'Halo! Ada yang bisa saya bantu? 😊';
  } else if (lowerCaseMessage.includes('pemesanan')) {
    return 'Untuk membuat pemesanan meja, silakan gunakan formulir di halaman pemesanan.';
  } else {
    return 'Maaf, saya tidak mengerti. Bisa ulangi pertanyaan Anda? 🤔';
  }
}