"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
class BaseError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static BadRequest(message) {
        return new BaseError(400, message);
    }
    static NotFound(message) {
        return new BaseError(404, message);
    }
    static InternalError(message) {
        return new BaseError(500, message);
    }
}
exports.BaseError = BaseError;
