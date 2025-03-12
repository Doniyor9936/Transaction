import { NextFunction, Request, Response } from "express";
import User from "../model/userModel";
import Payment from "../model/paymentModel";
import { Op } from "sequelize";

export const performTransaction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { userId, amount } = req.body
        const findUser = await User.findByPk(userId)
        if (!findUser) {
            return res.status(404).json({ message: "user not found" })
        }
        const payment = await Payment.create({ userId, amount })
        const user = await User.findByPk(userId)
        return res.status(200).json({ message: `The id:${userId} user has made a payment: ${amount}`, payment, user })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" })
    }
}
export const checkTransaction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(404).json({ message: "id not found" })
        }
        const transaction = await Payment.findByPk(id)
        if (!transaction) {
            return res.status(404).json({ message: "payment not found" })
        }
        return res.status(200).json({ message: "checkTransaction", transaction })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" })
    }
}
export const getStatement = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { startDate, endDate } = req.query
        if (!startDate || !endDate) {
            return res.status(404).json({ message: "startDate endDate required" })
        }
        const transactions = await Payment.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(startDate as string),
                    [Op.lte]: new Date(endDate as string),
                },
            },
        });
        return res.status(200).json({ message: "transaction statements", transactions })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" })
    }
}
export const cancelTransaction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(404).json({ message: "id not found" })
        }
        await Payment.destroy({ where: { id } })
        return res.status(200).json({ message: "delete succesfully" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" })
    }
}