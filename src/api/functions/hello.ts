import { APIGatewayEvent, Context } from "aws-lambda";

import globalMiddleware from "../lib/middleware/globalMiddleware";
import { ok } from "../lib/httpHelpers/httpResponse";

async function hello(event: APIGatewayEvent, context: Context) {
  return ok({ message: "Hello World" });
}

export const handler = globalMiddleware(hello, ["get"]);