import { Event, Context } from '../lib/types/netlify';
import globalMiddleware from "../lib/middleware/globalMiddleware";
import { ok } from "../lib/httpHelpers/httpResponse";

async function hello(event: Event, context: Context) {
  return ok({message: "Hello world"});
}

export const handler = globalMiddleware(hello, ["get"]);