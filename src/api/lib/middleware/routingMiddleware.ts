import createMatcher from "feather-route-matcher";
import { notFound } from "../httpHelpers/httpResponse";
import { Callback, Context, Event, Handler } from "../types/netlify";
import { SubRoutes } from "../types/routing";

export default function routingMiddleware(handler: Handler, subRoutes?: SubRoutes) {
  return async (event: Event, context: Context, callback: Callback) => {
        const baseRoute = event.baseRoute;
        if (!baseRoute || !event.path.includes(baseRoute)) {
            throw `routingMiddleware - route '${baseRoute}' is not included in ${event.path}`;
        }

        const indexRoute = `/api/${baseRoute}`;
        const indexRouteV2 = `/api/${baseRoute}/`;
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