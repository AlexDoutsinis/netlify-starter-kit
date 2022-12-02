import { notFound } from "../httpHelpers/httpResponse";
import { Callback, Context, Event, Handler } from "../types/netlify";

export default function httpMethodGuardMiddleware(handler: Handler, allowedHttpMethods: string[]) {
  return async (event: Event, context: Context, callback: Callback) => {
    allowedHttpMethods = allowedHttpMethods.map(x => x.toLowerCase());
    const httpMethodNotAllowed = !allowedHttpMethods.includes(event.httpMethod.toLowerCase());

    if (httpMethodNotAllowed) {
      return notFound();
    }

    return handler(event, context, callback);
  };
}