// 
import { User } from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/tokens.js';

const REFRESH_COOKIE_NAME = 'ftt_refresh_token';
const REFRESH_COOKIE_PATH = '/api/auth';
const MAX_ACTIVE_SESSIONS = 5; // cap concurrent device sessions per user
const isProd = process.env.NODE_ENV === 'production';

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days, matches refresh token expiry
    path: REFRESH_COOKIE_PATH,
  });
}

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [hashToken(refreshToken)];
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.status(201).json({ user: user.toJSON(), accessToken });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshTokens');
    const isMatch = user ? await user.comparePassword(password) : false;

    if (!user || !isMatch) {
      // Same message for "no user" and "wrong password" — don't leak which one.
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [...user.refreshTokens, hashToken(refreshToken)].slice(-MAX_ACTIVE_SESSIONS);
    await user.save();

    setRefreshCookie(res, refreshToken);
    return res.status(200).json({ user: user.toJSON(), accessToken });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Reads refresh token from httpOnly cookie, rotates it, issues a new access token.
 */
export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: 'No refresh token provided.' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
      return res.status(401).json({ message: 'Refresh token invalid or expired. Please log in again.' });
    }

    const incomingHash = hashToken(token);
    const newRefreshToken = generateRefreshToken(decoded.sub);
    const newHash = hashToken(newRefreshToken);

    // Atomic rotate: pull the used token and push the new one in a single
    // database operation (an aggregation-pipeline update), keyed on the
    // token actually being present on the document right now.
    //
    // We deliberately do NOT fetch the user, mutate the array in memory,
    // then call .save() — that read-modify-write pattern races under
    // Mongoose's optimistic-concurrency (__v) check whenever two refresh
    // calls land close together (e.g. the same account open in two
    // browser tabs, both holding the same refresh-token cookie). The
    // first .save() succeeds, the second throws VersionError. Doing the
    // whole rotation as one atomic findOneAndUpdate removes the race
    // entirely — there's no in-memory version to go stale.
    const updatedUser = await User.findOneAndUpdate(
      { _id: decoded.sub, refreshTokens: incomingHash },
      [
        {
          $set: {
            refreshTokens: {
              $slice: [
                {
                  $concatArrays: [
                    { $filter: { input: '$refreshTokens', cond: { $ne: ['$$this', incomingHash] } } },
                    [newHash],
                  ],
                },
                -MAX_ACTIVE_SESSIONS,
              ],
            },
          },
        },
      ],
      { new: true }
    );

    if (!updatedUser) {
      // Token not recognized — either already rotated/revoked, or reused (replay attack).
      // Fail closed: force a fresh login rather than silently issuing a new token.
      return res.status(401).json({ message: 'Refresh token revoked. Please log in again.' });
    }

    const newAccessToken = generateAccessToken(decoded.sub);
    setRefreshCookie(res, newRefreshToken);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Revokes the current device's refresh token and clears the cookie.
 */
export async function logout(req, res, next) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];

    if (token) {
      try {
        const decoded = verifyRefreshToken(token);
        const incomingHash = hashToken(token);
        // Atomic $pull — same rationale as refresh() above: no read-modify-write race.
        await User.findByIdAndUpdate(decoded.sub, { $pull: { refreshTokens: incomingHash } });
      } catch {
        // Token already invalid/expired — nothing to revoke, just clear the cookie below.
      }
    }

    res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Requires `protect` middleware.
 */
export async function getMe(req, res) {
  return res.status(200).json({ user: req.user.toJSON() });
}