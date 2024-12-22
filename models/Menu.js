// Import mongoose
const mongoose = require('mongoose');

// Skema untuk koleksi Menu
const menuSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
    required: true,
  },
  harga: {
    type: Number,
    required: true,
  },
  kategori: {
    type: String,
    required: true, // Misalnya: "Makanan", "Minuman", "Dessert"
  },
}, {
  timestamps: true, // Menambahkan createdAt dan updatedAt secara otomatis
});

// Model untuk Menu
const Menu = mongoose.model('Menu', menuSchema);

// Ekspor model Menu
module.exports = Menu;
