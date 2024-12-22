const mongoose = require('mongoose');
require('dotenv').config(); // Memuat variabel dari file .env
const uri = process.env.MONGO_URI;
const jadwal = require('./jadwal')
const pesanan = require('./pesanan')

async function connectDB() {
    try {
        console.log('Mencoba menghubungkan ke MongoDB...');
        await mongoose.connect(uri);
        console.log('Koneksi MongoDB berhasil!');
    } catch (error) {
        console.error('Koneksi MongoDB gagal:', error.message);
        process.exit(1); // Keluar dari proses jika koneksi gagal
    }
};

async function filterJadwal(kereta, stasiun) {
    try {
        const hasil = await jadwal.find({ KA: kereta, Stasiun: stasiun, Berangkat: { $ne: '-' } });
        return hasil;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function getJadwal(param) {
    try {
        const hasil = await jadwal.find({ KA: `${param}` });
        return hasil;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function simpanPesanan(dataPesanan) {
    try {
        console.log("dataPesanan", dataPesanan)
        const pesananBaru = new pesanan(dataPesanan);
        pesananBaru.save();
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    connectDB, getJadwal, filterJadwal, simpanPesanan
};
