const express = require('express');
const router = express.Router();
const mongodb = require('../models/db'); 

router.post('/filterJadwal', async (req, res) => {
    console.log("FILTERJADWAL")
    console.log(req.body)
    let jadwal = await mongodb.filterJadwal(req.body.ka, req.body.stasiun);
    console.log("hasil jadwal", jadwal)
    res.json(jadwal)
});

module.exports = router;
