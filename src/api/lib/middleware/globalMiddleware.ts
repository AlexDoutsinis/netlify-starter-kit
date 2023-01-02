import { Handler } from "../types/netlify";
import { SubRoutes } from '../types/routing';
import bodyParserMiddleware from './bodyParserMiddleware';
import httpMethodGuardMiddleware from './httpMethodGuardMiddleware';
import rateLimiterMiddleware from './rateLimiterMiddleware';
import routingMiddleware from './routingMiddleware';
import errorCatcherMiddleware from "./errorCatcherMiddleware";

export default function globalMiddleware(handler: Handler, allowedHttpMethods: string[], subRoutes?: SubRoutes) {
    const handlerName = handler.name;

    handler = bodyParserMiddleware(handler)
    handler = routingMiddleware(handler, handlerName, subRoutes);
    handler = httpMethodGuardMiddleware(handler, allowedHttpMethods);
    handler = errorCatcherMiddleware(handler); 
    handler = rateLimiterMiddleware(handler); // first middleware in the pipeline

    return handler
}