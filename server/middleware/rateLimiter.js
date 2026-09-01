// import rateLimit from 'express-rate-limit';

// // Applied to /register and /login only — generous enough for real users,
// // tight enough to slow down credential-stuffing / brute force attempts.
// export const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 20,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: 'Too many attempts. Please try again in a few minutes.' },
// });

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

// Applied to /vision/upload — image uploads hit Cloudinary's paid API,
// so this caps abuse without blocking normal fridge-scanning usage.
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many image uploads. Please try again in a few minutes.' },
});
