import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import foodRouter from "./Routes/foodRoutes.js";
import orderRouter from "./Routes/orderRoute.js";
import adminRouter from "./Routes/adminRoutes.js";
import userRouter from "./Routes/userRoutes.js";

const app = express();
const { MONGO_URL, PORT } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB is Connected Successfully");
  })
  .catch((err) => {
    console.error(err);
  });
app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use("/food", foodRouter);
app.use("/order", orderRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
