import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import { Handler, APIGatewayEvent, Context, Callback } from "aws-lambda";

function middleware(handler: Handler) {
  return middy(handler).use([httpJsonBodyParser(), httpEventNormalizer(), httpErrorHandler()]);
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

        return middleware(handler)(event, context, callback)
    }
}