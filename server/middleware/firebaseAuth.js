import admin from '../config/firebaseAdmin.js';

export function firebaseAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  admin.auth().verifyIdToken(token)
    .then((decoded) => {
      req.user = decoded;
      next();
    })
    .catch((err) => {
      console.error('❌ Firebase Auth Error:', err.message);
      res.status(401).json({ message: 'Invalid token' });
    });
}
