import { Request, Response, NextFunction } from "express";
import bcrypt, { compare } from "bcryptjs";
import User from "../model/userModel";
import MailService from "../service/mailService";
import { BaseError } from "../error/errorHandler";
import { codeGenerate } from "../util/helperFunction";
import { when } from "joi";
import { where } from "sequelize";
import { accessToken, refreshToken } from "../util/tokenGenerate";
import mailService from "../service/mailService";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { username, email, password, gender, age, role } = req.body;

    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const code = codeGenerate();
    const hashPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      email,
      password: hashPassword,
      username,
      gender,
      age,
      verificationCode: code,
      role,
    });

    await MailService.sendMail(email, code);

    setTimeout(
      async () => {
        await User.update({ verificationCode: 0 }, { where: { id: user.id } });
      },
      15 * 60 * 1000,
    );

    return res.status(201).json({
      message: "Registered successfully, please verify your email",
      user,
    });
  } catch (error) {
    console.error(error);
    next(BaseError.InternalError((error as Error).message));
  }
};

export const getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const foundetUser = await User.findOne();
    if (!foundetUser) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ message: "users", foundetUser });
  } catch (error) {
    console.error(error);
    next(BaseError.InternalError((error as Error).message));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { email, password } = req.body;
    const foundetUser = await User.findOne({ where: { email } });
    if (!foundetUser) {
      console.log("xatolik bor");

      return next(BaseError.BadRequest("user not found"));
    }
    const comparePsw = await bcrypt.compare(password, foundetUser.password);
    const payload = {
      email: foundetUser.email,
      id: foundetUser.id,
      role: foundetUser.role,
    };
    let accessTokenChek = accessToken(payload);
    let refreshTokenChek = refreshToken(payload);

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
    } else {
      return res.status(401).json({ message: "Password error or verification error" });
    }
  } catch (error) {
    return next(BaseError.BadRequest("system connection error"));
  }
};
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });

    return res.status(200).json({ message: "You have successfully logged out." });
  } catch (error) {
    return next(BaseError.BadRequest("Error logging out"));
  }
};
export const forgotPsw = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { email } = req.body;
  const foundetUser = await User.findOne({ where: { email } });
  if (!foundetUser) {
    return res.status(404).json({ message: "no such user found" });
  }
  const newPsw = codeGenerate();
  const hashPassword = await bcrypt.hash(newPsw, 10);
  foundetUser.password = hashPassword;
  await foundetUser.save();

  mailService.sendMail(email, newPsw);
  return res.status(201).json({ message: "New password sent to email" });
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { username, email, password, gender, age, role } = req.body;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id not found" });
    }
    const findUser = await User.findByPk(id);
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }
    await User.update({ username, email, password, gender, age, role }, { where: { id } });
    return res.status(200).json({ message: "user succes edit" });
  } catch (error) {
    console.error(error);
    next(BaseError.InternalError((error as Error).message));
  }
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }
    await User.destroy({ where: { id } });
    return res.status(200).json({ message: "user succes delete" });
  } catch (error) {
    console.error(error);
    next(BaseError.InternalError((error as Error).message));
  }
};
export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { password, newPassword } = req.body;
    if (!id) {
      return res.status(400).json({ message: "id not found" });
    }
    const foundetUser = await User.findByPk(id);
    if (!foundetUser) {
      return res.status(400).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, foundetUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "old password is incorrect" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await foundetUser.update({ password: hashPassword });
    return res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    console.error(error);
    next(BaseError.InternalError((error as Error).message));
  }
};
