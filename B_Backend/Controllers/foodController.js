import mongoose from "mongoose";

import Food from "../Models/foodSchema.js";

export const getAllFood = async (req, res) => {
  try {
    const Foods = await Food.find();
    if (Foods) {
      return res.status(200).json({
        success: true,
        Foods,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "err.message",
      success: false,
    });
  }
};

export const getFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      res.status(404).json({
        message: "Food not Found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Food Fetched Successfully",
      status: true,
      food,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
      status: false,
    });
  }
};


