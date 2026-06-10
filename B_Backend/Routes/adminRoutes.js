import express from "express";

import { getAllFood } from "../Controllers/foodController.js";
import {
  addFood,
  addMultipleFoods,
  adminLogin,
  deleteFood,
  deleteOrder,
  getChartsData,
  getCount,
  orderCompleted,
} from "../Controllers/adminController.js";
import { getAllOrders } from "../Controllers/orderController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.get("/counts", getCount); // get  food count , ordercount , orderStatus count

router.get("/chartsData", getChartsData);

// food Routes
router.post("/addFood", addFood);
router.post("/addMultipleFoods", addMultipleFoods);
router.get("/getFoods", getAllFood);
router.delete("/deleteFood/:id", deleteFood);

// order routes
router.put("/completed/:id", orderCompleted);
router.delete("/deleteOrder", deleteOrder);
router.get("/getAllOrders", getAllOrders);

export default router;
