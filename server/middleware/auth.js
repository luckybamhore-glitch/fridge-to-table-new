import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';

/**
 * Requires a valid `Authorization: Bearer <accessToken>` header.
 * Attaches the full Mongoose user document to req.user.
 */
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized. No access token provided.' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Access token expired.'
          : 'Not authorized. Invalid access token.';
      return res.status(401).json({ message });
    }

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized. User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Auth features require persistent storage. If Mongo isn't connected,
 * fail fast with a clear message instead of throwing deep in a controller.
 */
export function requireDB(req, res, next) {
  if (!isMongoConnected) {
    return res.status(503).json({
      message: 'Database unavailable. Accounts, pantry, and favorites require MongoDB to be connected.',
    });
  }
  next();
}
