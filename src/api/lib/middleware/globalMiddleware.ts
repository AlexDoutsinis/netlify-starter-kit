import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import { Handler } from "aws-lambda";

export default function globalMiddleware(handler: Handler) {
  return middy(handler).use([httpJsonBodyParser(), httpEventNormalizer(), httpErrorHandler()]);
}

// todos:
// add ts config - done
// find a good solution for routing
