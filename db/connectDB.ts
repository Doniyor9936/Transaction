import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: Number(process.env.DB_PORT),
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to database!");

    await import("../model/userModel");

    await sequelize.sync({ alter: true });
    console.log(" Tables synced successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default sequelize;
