const express = require('express');
const router = express.Router();
const mongodb = require('../models/db');
const nodemailer = require('nodemailer');

// Rute untuk mendapatkan semua pemesanan tiket (GET)
router.get('/', async (req, res) => {
    res.render('pesan-tiket')
});

router.get('/sukses', async (req, res) => {
    res.render('pesan-sukses')
});

router.post('/', async (req, res) => {
    try {
        hasilForm = req.body;
        hasilForm["kodeTiket"] = buatKodeRandomTiket();
        console.log("hasilForm", hasilForm)
        await mongodb.simpanPesanan(hasilForm);
        kirimEmail(hasilForm);
        res.render('pesan-hasil', {hasil: 'Sukses. Silahkan periksa email Anda'});
    } catch(err){
        console.log(err)
        res.render('pesan-hasil', {hasil: 'Gagal. Silahkan coba lagi'});
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

async function kirimEmail(mailData) {
    let transporter = nodemailer.createTransport({
        host: 'mail.aplikasia.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'gpslv@aplikasia.com', // generated ethereal user
            pass: 'GPS121120-email', // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    if (mailData) {
        let mail_name = `${mailData.namaPenumpang}`;
        let mail_email = `${mailData.emailPenumpang}`;
        let from_mail = `gpslv@aplikasia.com`;
        let mail_subject = `KAI Tiket ${mailData.jenisKereta} - Bapak/Ibu ${mailData.namaPenumpang}`;

        let konten = `        
<p>
Kepada Yth,<br>
Bapak/Ibu<br>
<b>${mailData.namaPenumpang}</b><br>
Berikut adalah detail tiket Anda
</p>
<h3>Kode Tiket: ${mailData.kodeTiket}</h3>
<p>
<b>Nama</b> : ${mailData.namaPenumpang}<br>
<b>Email</b> : ${mailData.emailPenumpang}<br>
<b>NIK</b> : ${mailData.nik}<br>
<b>Jenis KA</b> : ${mailData.jenisKereta}<br>
<b>Stasiun Asal</b> : ${mailData.asal}<br>
<b>Stasiun Tujuan</b> : ${mailData.tujuan}<br>
<b>Tanggal</b> : ${mailData.tanggalKeberangkatan}<br>
<b>Jadwal Keberangkatan</b> : ${mailData.jadwal}<br>
<b>Nomor Kursi</b> : ${mailData.nomorKursi}<br>
<b>Harga Tiket</b> : ${mailData.hargaTiket}<br>
</p>

<p>
Dengan ini kami sampaikan untuk datang ke stasiun paling lambat 15 menit sebelum jadwal keberangkatan untuk menghindari ketinggalan kereta. Terima kasih
</p>
        `;
        transporter.sendMail({
            from: from_mail,
            to: mail_email,
            subject: mail_subject,
            html: konten
        }).then((result) => {
            if (result.messageId) {
                console.log('Sukses Kirim Email', result)
            } else {
                console.log('Error Kirim Email', result)
            }
        }).catch((error) => {
            console.error(error);
            console.log('Email Error', error)
        });
        console.log(`Email selesai diproses`)
        return (konten);
    } else {
        console.log(`Email gagal`)
    }
}

module.exports = router;
