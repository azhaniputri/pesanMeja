// Import model Menu
const Menu = require('../models/Menu');

// Fungsi untuk menambahkan menu baru
const tambahMenu = async (req, res) => {
  try {
    const { nama, deskripsi, harga, kategori } = req.body;
    const menuBaru = new Menu({ nama, deskripsi, harga, kategori });
    await menuBaru.save();
    res.status(201).json({ pesan: 'Menu berhasil ditambahkan', menu: menuBaru });
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menambahkan menu', error: error.message });
  }
};

// Fungsi untuk mendapatkan semua menu
const dapatkanSemuaMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mendapatkan menu', error: error.message });
  }
};

// Fungsi untuk memperbarui menu
const perbaruiMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi, harga, kategori } = req.body;
    const menuTerupdate = await Menu.findByIdAndUpdate(
      id,
      { nama, deskripsi, harga, kategori },
      { new: true }
    );
    res.status(200).json({ pesan: 'Menu berhasil diperbarui', menu: menuTerupdate });
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal memperbarui menu', error: error.message });
  }
};

// Fungsi untuk menghapus menu
const hapusMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.status(200).json({ pesan: 'Menu berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menghapus menu', error: error.message });
  }
};

// Ekspor fungsi
module.exports = {
  tambahMenu,
  dapatkanSemuaMenu,
  perbaruiMenu,
  hapusMenu,
};
