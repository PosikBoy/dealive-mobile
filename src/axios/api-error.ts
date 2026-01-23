export interface BackendError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  status: number;
  error?: string;
}
