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
exports.cancelTransaction = exports.getStatement = exports.checkTransaction = exports.performTransaction = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const paymentModel_1 = __importDefault(require("../model/paymentModel"));
const sequelize_1 = require("sequelize");
const performTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount } = req.body;
        const findUser = yield userModel_1.default.findByPk(userId);
        if (!findUser) {
            return res.status(404).json({ message: "user not found" });
        }
        const payment = yield paymentModel_1.default.create({ userId, amount });
        const user = yield userModel_1.default.findByPk(userId);
        return res.status(200).json({ message: `The id:${userId} user has made a payment: ${amount}`, payment, user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" });
    }
});
exports.performTransaction = performTransaction;
const checkTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: "id not found" });
        }
        const transaction = yield paymentModel_1.default.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ message: "payment not found" });
        }
        return res.status(200).json({ message: "checkTransaction", transaction });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" });
    }
});
exports.checkTransaction = checkTransaction;
const getStatement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(404).json({ message: "startDate endDate required" });
        }
        const transactions = yield paymentModel_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: new Date(startDate),
                    [sequelize_1.Op.lte]: new Date(endDate),
                },
            },
        });
        return res.status(200).json({ message: "transaction statements", transactions });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" });
    }
});
exports.getStatement = getStatement;
const cancelTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ message: "id not found" });
        }
        yield paymentModel_1.default.destroy({ where: { id } });
        return res.status(200).json({ message: "delete succesfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" });
    }
});
exports.cancelTransaction = cancelTransaction;
