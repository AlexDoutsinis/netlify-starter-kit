import { Callback, Context, Event, Handler } from "../types/netlify";

export default function ensureHandlerNameMatchesWithBaseRouteMiddleware(handler: Handler, rootHandlerName: string) {
  return async (event: Event, context: Context, callback: Callback) => {
    if (!rootHandlerName || !event.path.includes(rootHandlerName)) {
        throw `handlerNameCheckerMiddleware: - The handler name must be the same with it's corresponding route - handlerName '${rootHandlerName}' is not included in path: '${event.path}'`;
    }
    event.baseRoute = rootHandlerName;

    return handler(event, context, callback);
  };
}