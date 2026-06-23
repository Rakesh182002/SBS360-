import jwt from 'jsonwebtoken';
import Configuration from '../environment/Configuration.json' with { type: 'json' };

const env = process.env.NODE_ENV ?? 'development';
const configuration = Configuration[env];
const JWT_SECRET = configuration.JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret_xyz';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied. No authorization token provided.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attaches { id, username, first_name, last_name, email, role, permissions }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired. Please refresh your session.', 
        code: 'TOKEN_EXPIRED' 
      });
    }
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or corrupt access token.' 
    });
  }
};

export default authMiddleware;
