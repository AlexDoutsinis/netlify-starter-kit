import { APIGatewayEvent } from 'aws-lambda';
import limiter from 'lambda-rate-limiter';

const rateLimit = limiter({
  interval: 60 * 1000
}).check;

export default async function rateLimiter(event: APIGatewayEvent) {
    const maxAmountOfRequestsAllowed = 10
    const ip = event.headers["client-ip"] as string
    await rateLimit(maxAmountOfRequestsAllowed, ip)
}