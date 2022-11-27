import { Event, Context } from '../lib/types/netlify';
import globalMiddleware from "../lib/middleware/globalMiddleware";
import { notFound, ok } from "../lib/httpHelpers/httpResponse";
import { Routes } from './../lib/types/router';

async function hello(event: Event, context: Context) {
  if (event.paramsAreEmpty) return notFound();

  const res = {
    params: event.params,
    queryStringParams: event.queryStringParameters,
    path: event.path
  }

  return ok(res);
}

const subRoutes: Routes = {
  "/:id": hello,
  "/message": () => import("../subRoutes/hello/message").then(m => m.message),
  "/counter/:id": () => import("../subRoutes/hello/counter").then(m => m.counter)
}

export const handler = globalMiddleware(hello, ["get"], subRoutes);