export class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: any;

  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    data?: T,
    meta?: any,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
