import { HttpSuccess } from './../types/http';

export const ok = (body?: object): HttpSuccess => {
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

export const created = (body?: object): HttpSuccess => {
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