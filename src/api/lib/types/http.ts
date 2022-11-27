export interface HttpMethod {
  get: boolean;
  post: boolean;
  put: boolean;
  patch: boolean;
  delete: boolean;
}

export interface HttpResponse {
  statusCode: string;
  body?: string;
}