import express from "express";
import {

  getAllOrders,
  getOrder,
  orderFood,
  getBillByTable,
  payBill,
} from "../Controllers/orderController.js";
const router = express.Router();

router.post("/orderFood", orderFood);
router.get("/getAllOrders", getAllOrders);
router.get("/getOrder/:orderId", getOrder);
router.get("/bill/:tableNumber", getBillByTable);
router.put("/pay/:orderId", payBill);


export default router;
