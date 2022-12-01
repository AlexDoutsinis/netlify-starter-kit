import limiter from 'lambda-rate-limiter';
import { Event } from '../types/netlify';

const rateLimit = limiter({
  interval: 60 * 1000
}).check;

export default async function rateLimiterMiddleware(event: Event) {
    const maxAmountOfRequestsAllowed = 10
    const ip = event.headers["client-ip"] as string
    await rateLimit(maxAmountOfRequestsAllowed, ip)
}