const express = require('express');
const router = express.Router();
const mongodb = require('../models/db'); 

// Rute untuk mendapatkan semua pemesanan tiket (GET)
router.get('/', async (req, res) => {
    res.redirect('/jadwal/pariaman')
});

router.get('/pariaman', async (req, res) => {
    let jadwal = await mongodb.getJadwal('Pariaman Express');
    console.log(JSON.stringify(jadwal))
    const grupJadwal = {};
    jadwal.forEach(item => {
        if (!grupJadwal[item.Jadwal]) {
            grupJadwal[item.Jadwal] = [];
        }
        grupJadwal[item.Jadwal].push(item);
    });
    res.render('pariaman', {grupJadwal} )
});

router.get('/minangkabau', async (req, res) => {
    let jadwal = await mongodb.getJadwal('Minangkabau Express');
    const grupJadwal = {};
    jadwal.forEach(item => {
        if (!grupJadwal[item.Jadwal]) {
            grupJadwal[item.Jadwal] = [];
        }
        grupJadwal[item.Jadwal].push(item);
    });
    console.log(jadwal)
    res.render('minangkabau', {grupJadwal} )
});

router.get('/lembah-anai', async (req, res) => {
    let jadwal = await mongodb.getJadwal('Lembah Anai');
    const grupJadwal = {};
    jadwal.forEach(item => {
        if (!grupJadwal[item.Jadwal]) {
            grupJadwal[item.Jadwal] = [];
        }
        grupJadwal[item.Jadwal].push(item);
    });
    console.log(jadwal)
    res.render('lembah-anai', {grupJadwal} )
});

module.exports = router;
