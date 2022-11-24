import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import { Handler, APIGatewayEvent, Context, Callback } from "aws-lambda";
import limiter from 'lambda-rate-limiter';

const rateLimit = limiter({
  interval: 60 * 1000
}).check;

function middleware(handler: Handler) {
  return middy(handler).use([httpJsonBodyParser(), httpEventNormalizer()]);
}

export default function globalMiddleware(handler: Handler, allowedHttpMethods: string[]) {
    return async (event: APIGatewayEvent, context: Context, callback: Callback) => {
        allowedHttpMethods = allowedHttpMethods.map(x => x.toLowerCase())
        const notFound = !allowedHttpMethods.includes(event.httpMethod.toLowerCase())
        if (notFound) {
            return {
                statusCode: "404"
            }
        }

        // ---- Security Layer ----
        // 1. Config CORS
        // 2. Check for custom header
        // 3. Implement a rate limiter to prevent spammers

        try {
            const maxAmountOfRequestsAllowed = 10
            const ip = event.headers["client-ip"] as string
            await rateLimit(maxAmountOfRequestsAllowed, ip)
        }
        catch(ex) {
            return { statusCode: 429 };
        }
        // ---- Security Layer ----

        // Execute the actually function
        return middleware(handler)(event, context, callback)
    }
}