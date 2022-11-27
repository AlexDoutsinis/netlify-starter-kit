import { HttpResponse } from './../types/http';

export const ok = (body?: object): HttpResponse => {
  if (body) {
    return {
      statusCode: "200",
      body: typeof body == "string" ? body : JSON.stringify(body),
    };
  }

  return {
    statusCode: "200",
  };
};

export const created = (body?: object): HttpResponse => {
  if (body) {
    return {
      statusCode: "201",
      body: typeof body == "string" ? body : JSON.stringify(body),
    };
  }

  return {
    statusCode: "201",
  };
};

export const notFound = (body?: object): HttpResponse => {
  if (body) {
    return {
      statusCode: "404",
      body: typeof body == "string" ? body : JSON.stringify(body),
    };
  }

  return {
    statusCode: "404",
  };
}