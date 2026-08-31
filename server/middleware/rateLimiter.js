import rateLimit from 'express-rate-limit';

// Applied to /register and /login only — generous enough for real users,
// tight enough to slow down credential-stuffing / brute force attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' },
});
