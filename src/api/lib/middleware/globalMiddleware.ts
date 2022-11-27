import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import createMatcher from 'feather-route-matcher'
import { Handler, Event, Context, Callback } from "../types/netlify";
import rateLimiter from "../services/rateLimiter";
import { notFound } from "../httpHelpers/httpResponse";
import { Routes } from './../types/router';

function middleware(handler: Handler) {
  return middy(handler).use([httpJsonBodyParser(), httpEventNormalizer()]);
}

export default function globalMiddleware(handler: Handler, allowedHttpMethods: string[], subRoutes?: Routes) {
    return async (event: Event, context: Context, callback: Callback) => {
        const handlerName = handler.name;
        if (!event.path.includes(handlerName)) {
            throw `globalMiddleware: the handler name must be the same with the route - ${handlerName} is not included in ${event.path}`;
        }

        allowedHttpMethods = allowedHttpMethods.map(x => x.toLowerCase())
        const routeNotFound = !allowedHttpMethods.includes(event.httpMethod.toLowerCase())
        if (routeNotFound) {
            return notFound();
        }

        // ---- Security Layer ----
        // 1. Config CORS
        // 2. Check for custom header
        // 3. Implement a rate limiter to prevent spammers

        try {
            await rateLimiter(event);
        }
        catch(ex) {
            return { statusCode: 429 };
        }
        // ---- Security Layer ----

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
        let currentHandler = currentRoute.value;

        const noMatch = typeof currentHandler != "function";
        if (noMatch) {
            return currentHandler;
        }

        const isSubRoute = typeof currentHandler == "function" && currentHandler.length < 1;
        if (isSubRoute) {
            currentHandler = await currentRoute.value();
        }

        return middleware(currentHandler)(event, context, callback);
    }
}