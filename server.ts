import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB";
import userRouter from "./router/userRouter";
import { paymentRouter } from "./router/paymentRouter";

dotenv.config();
const PORT = process.env.PORT || 4003;

const app = express();
app.use(express.json());
app.use(cors());

app.use(userRouter);
app.use(paymentRouter)

const connectServer = async () => {
  try {
    await connectDB();
    console.log(`database succes connect`);
  } catch (error) {
    console.error(`database unsucces connect, please try later again`);
  }
};
app.listen(PORT, () => {
  console.log(`server is running:http://localhost:${PORT}`);
});

connectServer();
