import { Event } from "../types/netlify";

export default function httpMethodGuardMiddleware(event: Event, allowedHttpMethods: string[]) {
  allowedHttpMethods = allowedHttpMethods.map(x => x.toLowerCase());
  const httpMethodNotAllowed = !allowedHttpMethods.includes(event.httpMethod.toLowerCase());

  return httpMethodNotAllowed;
}