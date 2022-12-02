import limiter from 'lambda-rate-limiter';
import { Callback, Context, Event, Handler } from '../types/netlify';

const rateLimit = limiter({
  interval: 60 * 1000
}).check;

export default function rateLimiterMiddleware(handler: Handler) {
  return async (event: Event, context: Context, callback: Callback) => {
    const maxAmountOfRequestsAllowed = 10
    const ip = event.headers["client-ip"] as string

    console.log("rate limiter")

    try {
      await rateLimit(maxAmountOfRequestsAllowed, ip)
    }
    catch(ex) {
      return { statusCode: 429 };
    }

    return handler(event, context, callback);
  };
}