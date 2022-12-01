import createMatcher from "feather-route-matcher";
import { notFound } from "../httpHelpers/httpResponse";
import { Event, Handler } from "../types/netlify";
import { Routes } from "../types/router";


export default async function routingMiddleware(event: Event, handler: Handler, subRoutes?: Routes) {
        const handlerName = handler.name;
        if (!event.path.includes(handlerName)) {
            throw `globalMiddleware: the handler name must be the same with the route - ${handlerName} is not included in ${event.path}`;
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

        return currentRouteHandler;
}