import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

console.log("ACCESS_SECRET:", process.env.ACCESS_SECRET);
console.log("REFRESH_SECRET:", process.env.REFRESH_SECRET);

export const accessToken = (payload: object): string => {
  if (!process.env.ACCESS_SECRET) {
    throw new Error("ACCESS_SECRET is not defined");
  }
  return jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TIME || "1d",
  });
};

export const refreshToken = (payload: object): string => {
  if (!process.env.REFRESH_SECRET) {
    throw new Error("REFRESH_SECRET is not defined");
  }
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TIME || "10d",
  });
};
