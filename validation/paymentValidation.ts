import Joi from "joi";

const paymentValidation = Joi.object({
    userId: Joi.number().integer().positive().required()
        .messages({
            "number.base": "User ID must be a number",
            "number.integer": "User ID must be an integer",
            "number.positive": "User ID must be a positive number",
            "any.required": "User ID is required"
        }),

    amount: Joi.number()
        .positive()
        .min(0.01)
        .max(10 ** 12)
        .precision(2)
        .required()
        .messages({
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be a positive value",
            "number.min": "Amount must be at least 0.01",
            "number.max": "Amount cannot exceed 1 trillion",
            "number.precision": "Amount can have at most 2 decimal places",
            "any.required": "Amount is required"
        }),

    status: Joi.string()
        .valid("pending", "successfully", "failed")
        .messages({
            "any.only": "Status must be one of 'pending', 'successfully', or 'failed'",
            "any.required": "Status is required"
        })
});

export default paymentValidation;
