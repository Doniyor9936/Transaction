"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.accessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("ACCESS_SECRET:", process.env.ACCESS_SECRET);
console.log("REFRESH_SECRET:", process.env.REFRESH_SECRET);
const accessToken = (payload) => {
    if (!process.env.ACCESS_SECRET) {
        throw new Error("ACCESS_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TIME || "1d",
    });
};
exports.accessToken = accessToken;
const refreshToken = (payload) => {
    if (!process.env.REFRESH_SECRET) {
        throw new Error("REFRESH_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TIME || "10d",
    });
};
exports.refreshToken = refreshToken;
