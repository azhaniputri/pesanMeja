const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  namaPengguna: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tanggal: {
    type: Date,
    required: true,
  },
  waktu: {
    type: String,
    required: true, // Misalnya: "18:00"
  },
  jumlahTamu: {
    type: Number,
    required: true,
  },
  tipeMeja: {
    type: String,
    required: true, // Misalnya: "Regular Table"
  },
  catatan: {
    type: String, // Opsional
  },
})

const Booking = mongoose.model('booking', bookingSchema);
module.exports = Booking;
