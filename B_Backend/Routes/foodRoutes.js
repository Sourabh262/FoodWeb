import express from "express";
import {

  getAllFood,
  getFood,
} from "../Controllers/foodController.js";

const router = express.Router();


router.get("/getFoods", getAllFood);
router.get("/:id/food", getFood);


export default router;
