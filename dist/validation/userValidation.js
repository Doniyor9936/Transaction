"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userValidation = joi_1.default.object({
    username: joi_1.default.string().min(3).max(100).required(),
    email: joi_1.default.string()
        .email()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required(),
    password: joi_1.default.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required(),
    age: joi_1.default.number().required(),
    gender: joi_1.default.string().valid("man", "voman").required(),
    role: joi_1.default.string().valid("user", "admin").required(),
});
exports.default = userValidation;
