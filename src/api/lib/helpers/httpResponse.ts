import createError from "http-errors";

interface HttpSuccess {
  statusCode: String;
  body?: String;
}

interface HttpError {
  notFound: (body?: string) => void;
  internalServerError: (body?: string) => void;
}

export const ok = (body?: Object): HttpSuccess => {
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

export const created = (body?: Object): HttpSuccess => {
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

export const throwResponse: HttpError = {
  notFound(body?: string): void {
    if (body) {
      throw new createError.NotFound(body);
    }

    throw new createError.NotFound();
  },
  internalServerError(body?: string): void {
    if (body) {
      throw new createError.InternalServerError(body);
    }

    throw new createError.InternalServerError();
  },
};
