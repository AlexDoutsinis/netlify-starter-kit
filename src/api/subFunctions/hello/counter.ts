import { Event, Context } from '../../lib/types/netlify';
import { ok } from "../../lib/httpHelpers/httpResponse";

export async function counter(event: Event, context: Context) {
  return ok({message: `Counter: ${event.params.id}`});
}