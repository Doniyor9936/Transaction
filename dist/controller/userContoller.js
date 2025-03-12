"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.deleteUser = exports.updateUser = exports.forgotPsw = exports.logout = exports.login = exports.getAllUser = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../model/userModel"));
const mailService_1 = __importDefault(require("../service/mailService"));
const errorHandler_1 = require("../error/errorHandler");
const helperFunction_1 = require("../util/helperFunction");
const tokenGenerate_1 = require("../util/tokenGenerate");
const mailService_2 = __importDefault(require("../service/mailService"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, gender, age, role } = req.body;
        const foundUser = yield userModel_1.default.findOne({ where: { email } });
        if (foundUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const code = (0, helperFunction_1.codeGenerate)();
        const hashPassword = yield bcryptjs_1.default.hash(password, 8);
        const user = yield userModel_1.default.create({
            email,
            password: hashPassword,
            username,
            gender,
            age,
            verificationCode: code,
            role,
        });
        yield mailService_1.default.sendMail(email, code);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield userModel_1.default.update({ verificationCode: 0 }, { where: { id: user.id } });
        }), 15 * 60 * 1000);
        return res.status(201).json({
            message: "Registered successfully, please verify your email",
            user,
        });
    }
    catch (error) {
        console.error(error);
        next(errorHandler_1.BaseError.InternalError(error.message));
    }
});
exports.register = register;
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundetUser = yield userModel_1.default.findOne();
        if (!foundetUser) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json({ message: "users", foundetUser });
    }
    catch (error) {
        console.error(error);
        next(errorHandler_1.BaseError.InternalError(error.message));
    }
});
exports.getAllUser = getAllUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const foundetUser = yield userModel_1.default.findOne({ where: { email } });
        if (!foundetUser) {
            console.log("xatolik bor");
            return next(errorHandler_1.BaseError.BadRequest("user not found"));
        }
        const comparePsw = yield bcryptjs_1.default.compare(password, foundetUser.password);
        const payload = {
            email: foundetUser.email,
            id: foundetUser.id,
            role: foundetUser.role,
        };
        let accessTokenChek = (0, tokenGenerate_1.accessToken)(payload);
        let refreshTokenChek = (0, tokenGenerate_1.refreshToken)(payload);
        res.cookie("accesToken", accessTokenChek, {
            httpOnly: true,
            maxAge: 60 * 30 * 1000,
        });
        res.cookie("refreshToken", refreshTokenChek, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000,
        });
        if (comparePsw) {
            return res.status(200).json({
                message: "You have successfully connected to the system.",
                accessTokenChek,
            });
        }
        else {
            return res.status(401).json({ message: "Password error or verification error" });
        }
    }
    catch (error) {
        return next(errorHandler_1.BaseError.BadRequest("system connection error"));
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken", { httpOnly: true });
        res.clearCookie("refreshToken", { httpOnly: true });
        return res.status(200).json({ message: "You have successfully logged out." });
    }
    catch (error) {
        return next(errorHandler_1.BaseError.BadRequest("Error logging out"));
    }
});
exports.logout = logout;
const forgotPsw = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const foundetUser = yield userModel_1.default.findOne({ where: { email } });
    if (!foundetUser) {
        return res.status(404).json({ message: "no such user found" });
    }
    const newPsw = (0, helperFunction_1.codeGenerate)();
    const hashPassword = yield bcryptjs_1.default.hash(newPsw, 10);
    foundetUser.password = hashPassword;
    yield foundetUser.save();
    mailService_2.default.sendMail(email, newPsw);
    return res.status(201).json({ message: "New password sent to email" });
});
exports.forgotPsw = forgotPsw;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, gender, age, role } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "id not found" });
        }
        const findUser = yield userModel_1.default.findByPk(id);
        if (!findUser) {
            return res.status(400).json({ message: "user not found" });
        }
        yield userModel_1.default.update({ username, email, password, gender, age, role }, { where: { id } });
        return res.status(200).json({ message: "user succes edit" });
    }
    catch (error) {
        console.error(error);
        next(errorHandler_1.BaseError.InternalError(error.message));
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: "id not found" });
        }
        yield userModel_1.default.destroy({ where: { id } });
        return res.status(200).json({ message: "user succes delete" });
    }
    catch (error) {
        console.error(error);
        next(errorHandler_1.BaseError.InternalError(error.message));
    }
});
exports.deleteUser = deleteUser;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { password, newPassword } = req.body;
        if (!id) {
            return res.status(400).json({ message: "id not found" });
        }
        const foundetUser = yield userModel_1.default.findByPk(id);
        if (!foundetUser) {
            return res.status(400).json({ message: "user not found" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, foundetUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "old password is incorrect" });
        }
        const hashPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield foundetUser.update({ password: hashPassword });
        return res.status(200).json({ message: "Password successfully updated" });
    }
    catch (error) {
        console.error(error);
        next(errorHandler_1.BaseError.InternalError(error.message));
    }
});
exports.updatePassword = updatePassword;
