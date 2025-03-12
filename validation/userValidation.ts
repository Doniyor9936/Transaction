import Joi from "joi";

const userValidation = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .required(),
  age: Joi.number().required(),
  gender: Joi.string().valid("man", "voman").required(),
  role: Joi.string().valid("user", "admin").required(),
});

export default userValidation;
