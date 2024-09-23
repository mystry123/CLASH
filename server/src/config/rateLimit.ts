import { rateLimit } from 'express-rate-limit'

export const appLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'Too many accounts created from this IP, please try again after an hour',
    // store: ... , // Redis, Memcached, etc. See below.
})

