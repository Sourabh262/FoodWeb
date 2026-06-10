import Food from "../Models/foodSchema.js";
import Order from "../Models/OrderSchema.js";

export const orderFood = async (req, res) => {
  try {
    const { custName, custPhone, tableNumber, items } = req.body;

    //  Basic validation
    if (
      !custName ||
      !custPhone ||
      !tableNumber ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all required details",
        success: false,
      });
    }

    //  Get all foodIds at once (FAST)
    const foodIds = items.map((item) => item.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } });

    let orderItems = [];
    let totalPrice = 0;

    //  Loop items
    for (let item of items) {
      if (!item.foodId || !item.quantity) {
        return res.status(400).json({
          message: "Each item must have foodId and quantity",
          success: false,
        });
      }

      // find matching food
      const food = foods.find(
        (f) => f._id.toString() === item.foodId.toString(),
      );

      if (!food) {
        return res.status(404).json({
          message: `Food not found for id ${item.foodId}`,
          success: false,
        });
      }

      orderItems.push({
        foodId: item.foodId,
        quantity: item.quantity,
        price: food.price,
      });

      totalPrice += food.price * item.quantity;
    }

    const existingOrder = await Order.findOne({
      tableNumber,
      orderStatus: "pending",
    });

    if (existingOrder) {
      for (let newItem of orderItems) {
        const index = existingOrder.items.findIndex(
          (item) => item.foodId.toString() === newItem.foodId.toString(),
        );

        if (index > -1) {
          existingOrder.items[index].quantity += newItem.quantity;
        } else {
          existingOrder.items.push(newItem);
        }

        existingOrder.totalPrice += newItem.price * newItem.quantity;
      }

      await existingOrder.save();

      return res.status(200).json({
        message: "Order updated successfully",
        success: true,
        order: existingOrder,
      });
    }

    const newOrder = new Order({
      custName,
      custPhone,
      tableNumber,
      items: orderItems,
      totalPrice,
      orderStatus: "pending",
    });

    await newOrder.save();

    res.status(200).json({
      message: "Order created successfully",
      success: true,
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Order Failed",
      success: false,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find().populate("items.foodId");

    return res.status(200).json({
      message: "Orders fetch successfully",
      success: true,
      orders: allOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Orders not found",
      success: false,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(404).json({
        message: "Order ID is required",
        success: false,
      });
    }

    const order = await Order.findById(orderId).populate({
      path: "items.foodId",
      select: "name",
    });
    res.status(200).json({
      message: "Order fetched successfully",
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Order not fetched",
      success: false,
    });
  }
};

export const getBillByTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const order = await Order.findOne({ tableNumber, orderStatus: "pending" }).populate("items.foodId");
    
    if (!order) {
      return res.status(404).json({
        message: "No active order found for this table",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Bill fetched successfully",
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export const payBill = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(orderId, { orderStatus: "completed" }, { new: true });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found", success: false });
    }

    res.status(200).json({
      message: "Payment successful. Table is now available.",
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed", success: false });
  }
};
