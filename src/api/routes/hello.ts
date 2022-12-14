import { Event, Context } from '../lib/types/netlify';
import globalMiddleware from "../lib/middleware/globalMiddleware";
import { notFound, ok } from "../lib/httpHelpers/httpResponse";
import { message } from '../subRoutes/hello/message';
import { counter } from '../subRoutes/hello/counter';

async function hello(event: Event, context: Context) {
  if (event.paramsAreEmpty) return notFound();

  const res = {
    params: event.params,
    queryStringParams: event.queryStringParameters,
    path: event.path
  }

  return ok(res);
}

// const subRoutes = {
//   "/message": message,
//   "/counter/:id": counter,
//   "/:id": hello,
// };

const subRoutes = {
  "/message": async (event: Event, context: Context) => {
    const module = await import("../subRoutes/hello/message")
    return module.message(event, context)
  },
  "/counter/:id": async (event: Event, context: Context) => {
    const module = await import("../subRoutes/hello/counter")
    return module.counter(event, context)
  },
  "/:id": hello,
};

export const handler = globalMiddleware(hello, ["get"], subRoutes)