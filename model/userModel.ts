import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connectDB";

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public age!: number;
  public email!: string;
  public gender!: "man" | "woman";
  public role!: "user" | "admin";
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    gender: {
      type: DataTypes.ENUM("man", "woman"),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  { sequelize, tableName: "users", timestamps: true },
);

export default User;
