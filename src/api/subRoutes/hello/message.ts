import { Event, Context } from '../../lib/types/netlify';
import { ok } from "../../lib/httpHelpers/httpResponse";

export async function message(event: Event, context: Context) {
  return ok({message: `Hello there!!`});
}