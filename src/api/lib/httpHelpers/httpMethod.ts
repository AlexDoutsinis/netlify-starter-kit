interface HttpMethod {
  get: boolean;
  post: boolean;
  put: boolean;
  patch: boolean;
  delete: boolean;
}

export const httpMethod = (method: string): HttpMethod => {
  const httpMethod: HttpMethod = {
    get: false,
    post: false,
    put: false,
    patch: false,
    delete: false,
  };

  if (method == "GET") httpMethod.get = true;
  if (method == "POST") httpMethod.post = true;
  if (method == "PUT") httpMethod.put = true;
  if (method == "PATCH") httpMethod.patch = true;
  if (method == "DELETE") httpMethod.delete = true;

  return httpMethod;
};
