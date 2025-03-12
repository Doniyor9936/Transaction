import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connectDB";
import User from "./userModel";
class Payment extends Model {
    public id!: number;
    public userId!: number;
    public amount!: number;
    public status!: "pending" | "succesfully" | "failed"
}
Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("pending", "succesfully", "failed"),
            allowNull: false,
            defaultValue: "pending"
        },
    },
    {
        sequelize,
        tableName: "payments",
        timestamps: true,
    },
)
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });

export default Payment;
