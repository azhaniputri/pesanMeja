const nodemailer = require('nodemailer');

async function kirimEmail(mailData) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true untuk port 465
    auth: {
      user: process.env.EMAIL_USER, // Email Anda
      pass: process.env.EMAIL_APP_PASSWORD, // App Password Gmail
    },
  });

  const konten = `
<p>
Kepada Yth,<br>
Bapak/Ibu<br>
<b>${mailData.namaPengguna}</b><br>
Berikut adalah detail tiket Anda
</p>
<h3>Kode Tiket: ${mailData.kodeTiket}</h3>
<p>
  <b> Nama Pengguna: ${mailData.namaPengguna} <br>
  <b> Tanggal: ${mailData.tanggal} <br>
  <b> Waktu: ${mailData.waktu} <br>
  <b> Jumlah Tamu: ${mailData.jumlahTamu} <br>
  <b> Tipe Meja: ${mailData.tipeMeja} <br>
  <b> Catatan: ${mailData.catatan ? mailData.catatan : 'Tidak ada catatan tambahan'} <br>
</p>

<p>
Dengan ini kami sampaikan untuk datang ke restoran paling lambat 15 menit dari jadwal yang Anda pesan untuk reservasi terlebih dahulu. Terima kasih.
</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: mailData.email,
    subject: `Pesanan ${mailData.namaPengguna} - Detail Tiket Anda`,
    html: konten,
  });
}

module.exports = { kirimEmail };