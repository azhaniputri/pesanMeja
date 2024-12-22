const mongoose = require('mongoose');

const connectDB = (mongoURI) => {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Berhasil terhubung ke MongoDB');
  })
  .catch((err) => {
    console.error('Gagal terhubung ke MongoDB:', err);
    process.exit(1); // Keluar jika gagal koneksi
  });
};

module.exports = connectDB;
