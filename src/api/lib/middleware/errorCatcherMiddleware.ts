import { Callback, Context, Event, Handler } from "../types/netlify";

export default function errorCatcherMiddleware(handler: Handler) {
  return async (event: Event, context: Context, callback: Callback) => {
    const handlerWithErrorCatch = handler(event, context, callback) as Promise<any>;
    handlerWithErrorCatch.catch(err => {
        // put your logs here
    });

    return handlerWithErrorCatch;
  };
}