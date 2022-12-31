import { Handler } from "../types/netlify";
import { SubRoutes } from '../types/routing';
import bodyParserMiddleware from './bodyParserMiddleware';
import httpMethodGuardMiddleware from './httpMethodGuardMiddleware';
import rateLimiterMiddleware from './rateLimiterMiddleware';
import routingMiddleware from './routingMiddleware';
import ensureHandlerNameMatchesWithBaseRouteMiddleware from './ensureHandlerNameMatchesWithBaseRouteMiddleware';

export default function globalMiddleware(handler: Handler, allowedHttpMethods: string[], subRoutes?: SubRoutes) {
    const rootHandlerName = handler.name;

    handler = bodyParserMiddleware(handler)
    handler = routingMiddleware(handler, subRoutes);
    handler = rateLimiterMiddleware(handler);
    handler = httpMethodGuardMiddleware(handler, allowedHttpMethods);
    handler = ensureHandlerNameMatchesWithBaseRouteMiddleware(handler, rootHandlerName); // first middleware in the pipeline

    return handler
}