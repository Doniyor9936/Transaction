export class BaseError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static BadRequest(message: string) {
    return new BaseError(400, message);
  }

  static NotFound(message: string) {
    return new BaseError(404, message);
  }

  static InternalError(message: string) {
    return new BaseError(500, message);
  }
}
