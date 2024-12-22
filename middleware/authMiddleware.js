const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Token dari header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Harap login terlebih dahulu.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Tambahkan data pengguna ke objek req
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token tidak valid.' });
  }
};

module.exports = authMiddleware;
