"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDB_1 = __importDefault(require("../db/connectDB"));
const userModel_1 = __importDefault(require("./userModel"));
class Payment extends sequelize_1.Model {
}
Payment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "succesfully", "failed"),
        allowNull: false,
        defaultValue: "pending"
    },
}, {
    sequelize: connectDB_1.default,
    tableName: "payments",
    timestamps: true,
});
Payment.belongsTo(userModel_1.default, { foreignKey: "userId", as: "user" });
userModel_1.default.hasMany(Payment, { foreignKey: "userId", as: "payments" });
exports.default = Payment;
