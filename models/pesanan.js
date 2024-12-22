const mongoose = require('mongoose');
const pesananSchema = new mongoose.Schema(
    {
        namaPenumpang:String,
        emailPenumpang:String,
        nik:String,
        jenisKereta:String,
        asal:String,
        tujuan:String,
        tanggalKeberangkatan:String,
        hargaTiket:Number,
        jadwal:String,
        nomorKursi:String,
        kodeTiket:String
    });

const pesanan = mongoose.model('pesanan', pesananSchema);
module.exports = pesanan;