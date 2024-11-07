
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('Authorization header missing');
    return res.status(401).json({ message: 'Access denied. No authorization header.' });
  }
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Token not found in Authorization header');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err){
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid token' });}
    console.log('Token verified successfully:', user); 
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
