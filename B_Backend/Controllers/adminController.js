import mongoose from "mongoose";

import Food from "../Models/foodSchema.js";
import Order from "../Models/OrderSchema.js";
import User from "../Models/UserSchema.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  try {
    if (!existingUser) {
      return res.status(403).json({ 
        message: "User not found",
        success: false,
      });
    }

    if (password != existingUser.password) {
      return res.status(403).json({
        message: "Wrong Password,Please try again",
        success: false,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }

  const jwtToken = jwt.sign(
    {
      email: existingUser.email,
      _id: existingUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "48h" },
  );

  const user = await User.findById(existingUser._id).select("-password");
  res.status(200).json({
    message: "Login Successfully",
    success: true,
    jwtToken,
    user,
  });
};

export const addFood = async (req, res) => {
  try {
    const { name, price, image, category, isAvailable, ingredients } = req.body;

    if (!name || !price || !category || !image || !ingredients) {
      return res
        .status(400)
        .json({ message: "All fields required", success: false });
    }

    const food = new Food({
      name,
      price,
      image,
      category,
      isAvailable,
      ingredients,
    });

    await food.save();
    res.status(200).json({
      message: "Food Added Successfully ",
      success: true,
      food,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add food",
      success: false,
    });
  }
};

export const addMultipleFoods = async (req, res) => {
  try {
    const { foods } = req.body;

    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of food items",
        success: false,
      });
    }

    // Basic validation for each item
    for (const food of foods) {
      if (!food.name || !food.price || !food.category || !food.image || !food.ingredients) {
        return res.status(400).json({
          message: "All fields are required for each food item",
          success: false,
        });
      }
    }

    const createdFoods = await Food.insertMany(foods);

    res.status(200).json({
      message: `${createdFoods.length} Foods Added Successfully`,
      success: true,
      foods: createdFoods,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add multiple foods",
      success: false,
    });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);
    res.status(200).json({
      message: "Food Deleted Successfully",
      success: true,
      food,
    });
  } catch (err) {
    res.status(500).json({
      message: "err.message",
      success: false,
    });
  }
};

export const orderCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    order.orderStatus = "served";
    await order.save();

    res.status(200).json({
      message: "Order served",
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Order not served",
      success: false,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
        success: false,
      });
    }

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Order deleted Successfully",
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Order not Deleted",
      success: false,
    });
  }
};

export const getCount = async (req, res) => {
  try {
    const foodCount = await Food.countDocuments();
    const orderCount = await Order.countDocuments();

    const pendingOrderCount = await Order.countDocuments({
      orderStatus: "pending",
    });
    const servedOrderCount = await Order.countDocuments({
      orderStatus: "served",
    });

    res.status(200).json({
      success: true,
      foodCount,
      orderCount,
      pendingOrderCount,
      servedOrderCount,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message, success: false });
  }
};

// charts  data
export const getChartsData = async (req, res) => {
  try {
    const allFoods = await Food.distinct("name");

    // Aggregate counts from DB
    const counts = await Food.aggregate([
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
        },
      },
    ]);

    // Merge counts with full list, set 0 for missing foods
    const foodChart = allFoods.map((name) => {
      const found = counts.find((c) => c._id === name);
      return {
        name,
        count: found ? found.count : 0,
      };
    });

    res.status(200).json({
      success: true,
      foodChart,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
