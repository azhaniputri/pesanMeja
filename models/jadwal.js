const mongoose = require('mongoose');
const jadwalSchema = new mongoose.Schema(
    {
        Jadwal: Number,
        Stasiun: String,
        Datang: String,
        Berangkat: String,
        KA: String,
        Harga: String
    });

const jadwal = mongoose.model('jadwal', jadwalSchema);
module.exports = jadwal;