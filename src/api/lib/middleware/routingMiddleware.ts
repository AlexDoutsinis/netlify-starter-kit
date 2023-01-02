import createMatcher from "feather-route-matcher";
import { notFound } from "../httpHelpers/httpResponse";
import { Callback, Context, Event, Handler } from "../types/netlify";
import { SubRoutes } from "../types/routing";

export default function routingMiddleware(handler: Handler, handlerName: string, subRoutes?: SubRoutes) {
  return async (event: Event, context: Context, callback: Callback) => {
        if (!handlerName || !event.path.includes(handlerName)) {
                throw `HandlerName '${handlerName}' is not included in path: '${event.path}'`;
            }

        const indexRoute = `/api/${handlerName}`;
        const indexRouteV2 = `/api/${handlerName}/`;
        const matcher: any = {};
        matcher[indexRoute] = handler;
        matcher[indexRouteV2] = handler;
        if (subRoutes) {
            Object.keys(subRoutes).forEach(r => {
                const route = `${indexRoute}${r}`;
                const routeV2 = `${indexRoute}${r}/`;
                const handler = subRoutes[r];

                matcher[route] = handler;
                matcher[routeV2] = handler;
            });
        }
        matcher["/*"] = notFound();

        const routeMatcher = createMatcher(matcher);
        const currentRoute: any = routeMatcher(event.path);

        event.params = currentRoute.params;
        event.paramsAreEmpty = Object.keys(currentRoute.params).length < 1;
        let currentRouteHandler: Handler = currentRoute.value;

        const noMatch = typeof currentRouteHandler != "function";
        if (noMatch) {
            return currentRouteHandler;
        }

        const isSubRoute = typeof currentRouteHandler == "function" && currentRouteHandler.length < 1;
        if (isSubRoute) {
            currentRouteHandler = await currentRoute.value();
        }

        return currentRouteHandler(event, context, callback);
  };
}