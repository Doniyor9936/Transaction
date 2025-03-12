"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const paymentValidation = joi_1.default.object({
    userId: joi_1.default.number().integer().positive().required()
        .messages({
        "number.base": "User ID must be a number",
        "number.integer": "User ID must be an integer",
        "number.positive": "User ID must be a positive number",
        "any.required": "User ID is required"
    }),
    amount: joi_1.default.number()
        .positive()
        .min(0.01)
        .max(10 ** 12)
        .precision(2)
        .required()
        .messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be a positive value",
        "number.min": "Amount must be at least 0.01",
        "number.max": "Amount cannot exceed 1 trillion",
        "number.precision": "Amount can have at most 2 decimal places",
        "any.required": "Amount is required"
    }),
    status: joi_1.default.string()
        .valid("pending", "successfully", "failed")
        .messages({
        "any.only": "Status must be one of 'pending', 'successfully', or 'failed'",
        "any.required": "Status is required"
    })
});
exports.default = paymentValidation;
