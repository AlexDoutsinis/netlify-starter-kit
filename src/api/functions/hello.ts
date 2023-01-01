import { Event, Context } from '../lib/types/netlify';
import globalMiddleware from "../lib/middleware/globalMiddleware";
import { notFound, ok } from "../lib/httpHelpers/httpResponse";

async function hello(event: Event, context: Context) {
  if (event.paramsAreEmpty) return notFound();

  const res = {
    params: event.params,
    queryStringParams: event.queryStringParameters,
    path: event.path
  }

  return ok(res);
}

const subRoutes = {
  "/message": async (event: Event, context: Context) => {
    const module = await import("../subFunctions/hello/message")
    return module.message(event, context)
  },
  "/counter/:id": async (event: Event, context: Context) => {
    const module = await import("../subFunctions/hello/counter")
    return module.counter(event, context)
  },
  "/:id": hello,
};

export const handler = globalMiddleware(hello, ["get"], subRoutes)

// TODOS:
// 1. fix edge env error
// 2. check netlify.toml
// 3. crete dev and prod envs. 'ensureHandlerNameMatchesWithBaseRouteMiddleware' should be executing only on dev env