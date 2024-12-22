const Booking = require('../models/Booking');
const transporter = require('../config/emailConfig');

// Fungsi untuk membuat pemesanan baru
const buatPemesanan = async (req, res) => {
  try {
      const { namaPengguna, email, tanggal, waktu, jumlahTamu, tipeMeja, catatan } = req.body;
      
      // Buat pemesanan
      const pemesananBaru = new Booking({ 
          namaPengguna, 
          email, 
          tanggal, 
          waktu, 
          jumlahTamu, 
          tipeMeja, 
          catatan 
      });

      // Simpan ke database
      await pemesananBaru.save();

      // Siapkan email
      const mailOptions = {
          from: {
              name: 'PesanMeja Restaurant',
              address: process.env.EMAIL_USER
          },
          to: email,
          subject: 'Konfirmasi Pemesanan Meja - PesanMeja',
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #333; text-align: center;">Konfirmasi Pemesanan Meja</h1>
                  <p>Halo ${namaPengguna},</p>
                  <p>Terima kasih telah melakukan pemesanan di PesanMeja. Berikut adalah detail pemesanan Anda:</p>
                  
                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                      <h3>Detail Pemesanan:</h3>
                      <ul style="list-style: none; padding: 0;">
                          <li>📅 Tanggal: ${new Date(tanggal).toLocaleDateString('id-ID')}</li>
                          <li>⏰ Waktu: ${waktu}</li>
                          <li>👥 Jumlah Tamu: ${jumlahTamu} orang</li>
                          <li>🪑 Tipe Meja: ${tipeMeja}</li>
                          <li>📝 Catatan: ${catatan || '-'}</li>
                      </ul>
                  </div>
                  
                  <p><strong>Penting:</strong></p>
                  <ul>
                      <li>Mohon datang 10 menit lebih awal dari waktu pemesanan</li>
                      <li>Reservasi akan dibatalkan jika Anda terlambat lebih dari 15 menit</li>
                      <li>Jika ada perubahan, silakan hubungi kami</li>
                  </ul>
                  
                  <p style="text-align: center; color: #666; margin-top: 30px;">
                      Salam,<br>
                      Tim PesanMeja
                  </p>
              </div>
          `
      };

      // Kirim email
      console.log('Mencoba mengirim email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email terkirim:', info.response);

      res.status(201).json({
          message: "Pemesanan berhasil dibuat!",
          booking: pemesananBaru
      });

  } catch (error) {
      console.error('Error dalam pembuatan pemesanan:', error);
      res.status(500).json({
          message: "Gagal membuat pemesanan",
          error: error.message
      });
  }
};

// Fungsi untuk mendapatkan semua pemesanan
const dapatkanSemuaPemesanan = async (req, res) => {
  try {
    const pemesanan = await Booking.find();
    res.status(200).json(pemesanan);
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal mendapatkan data pemesanan', error: error.message });
  }
};

// Fungsi untuk memperbarui pemesanan
const perbaruiPemesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaPengguna, email, tanggal, waktu, jumlahTamu, tipeMeja, catatan } = req.body;
    const pemesananTerupdate = await Booking.findByIdAndUpdate(
      id,
      { namaPengguna, email, tanggal, waktu, jumlahTamu, tipeMeja, catatan },
      { new: true }
    );

    // Kirim email update jika pemesanan berhasil diperbarui
    if (pemesananTerupdate) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Pembaruan Pemesanan Meja - PesanMeja',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Pembaruan Pemesanan Meja</h1>
            <p>Halo ${namaPengguna},</p>
            <p>Pemesanan Anda telah berhasil diperbarui. Berikut adalah detail pemesanan terbaru:</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Detail Pemesanan:</h3>
              <ul style="list-style: none; padding: 0;">
                <li>📅 Tanggal: ${new Date(tanggal).toLocaleDateString('id-ID')}</li>
                <li>⏰ Waktu: ${waktu}</li>
                <li>👥 Jumlah Tamu: ${jumlahTamu} orang</li>
                <li>🪑 Tipe Meja: ${tipeMeja}</li>
                <li>📝 Catatan: ${catatan || '-'}</li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #666; margin-top: 30px;">
              Salam,<br>
              Tim PesanMeja
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ 
      pesan: 'Pemesanan berhasil diperbarui dan email konfirmasi telah dikirim', 
      pemesanan: pemesananTerupdate 
    });
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal memperbarui pemesanan', error: error.message });
  }
};

// Fungsi untuk menghapus pemesanan
const hapusPemesanan = async (req, res) => {
  try {
    const { id } = req.params;
    const pemesanan = await Booking.findById(id);
    
    if (pemesanan) {
      // Kirim email pembatalan sebelum menghapus
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: pemesanan.email,
        subject: 'Pembatalan Pemesanan Meja - PesanMeja',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Pembatalan Pemesanan Meja</h1>
            <p>Halo ${pemesanan.namaPengguna},</p>
            <p>Pemesanan Anda telah dibatalkan.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>Detail Pemesanan yang Dibatalkan:</h3>
              <ul style="list-style: none; padding: 0;">
                <li>📅 Tanggal: ${new Date(pemesanan.tanggal).toLocaleDateString('id-ID')}</li>
                <li>⏰ Waktu: ${pemesanan.waktu}</li>
                <li>👥 Jumlah Tamu: ${pemesanan.jumlahTamu} orang</li>
                <li>🪑 Tipe Meja: ${pemesanan.tipeMeja}</li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #666; margin-top: 30px;">
              Salam,<br>
              Tim PesanMeja
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      await Booking.findByIdAndDelete(id);
    }

    res.status(200).json({ pesan: 'Pemesanan berhasil dihapus dan email konfirmasi telah dikirim' });
  } catch (error) {
    res.status(500).json({ pesan: 'Gagal menghapus pemesanan', error: error.message });
  }
};

module.exports = {
  buatPemesanan,
  dapatkanSemuaPemesanan,
  perbaruiPemesanan,
  hapusPemesanan,
};