import { Callback, Context, Event, Handler } from "../types/netlify";

export default function bodyParserMiddleware(handler: Handler) {
  return async (event: Event, context: Context, callback: Callback) => {
    if (event.body) {
      try {
        event.parsedBody = JSON.parse(event.body);
      } catch (err) {
        event.parsedBody = {};
      }
    } else {
      event.parsedBody = {};
    }

    return handler(event, context, callback);
  };
}