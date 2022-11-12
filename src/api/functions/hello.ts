import { APIGatewayEvent, Context } from "aws-lambda";

import globalMiddleware from "../lib/middleware/globalMiddleware";
import { ok, throwResponse } from "../lib/helpers/httpResponse";
import { httpMethod } from "../lib/helpers/httpMethod";

async function hello(event: APIGatewayEvent, context: Context) {
  const { get } = httpMethod(event.httpMethod);

  if (get) {
    return ok({ message: "Hello World" });
  }

  return throwResponse.notFound();
}

export const handler = globalMiddleware(hello);
