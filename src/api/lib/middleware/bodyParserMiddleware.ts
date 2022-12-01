import { Event } from "../types/netlify";

export default function bodyParserMiddleware(event: Event) {
  if (event.body) {
    try {
      event.parsedBody = JSON.parse(event.body);
    } catch (err) {
      event.parsedBody = {};
    }
  } else {
    event.parsedBody = {};
  }
}