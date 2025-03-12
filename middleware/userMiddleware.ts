import { NextFunction, Request, Response } from "express";
import userValidation from "../validation/userValidation";

const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { error } = userValidation.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      succes: false,
      message: "validate error",
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};

export default userMiddleware;
