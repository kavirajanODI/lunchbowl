const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrderCustomer,
  updateOrder,
  deleteOrder,
  getDashboardOrders,
  getDashboardRecentOrder,
  getBestSellerProductChart,
  getDashboardCount,
  getDashboardAmount,
  getAllFoodOrders,
  searchOrders,
  userSubscription,
  searchUserSubscriptions,
} = require("../controller/orderController");

// Add search route here
router.get("/search", searchOrders);

//get all orders
router.get("/", getAllOrders);

// get dashboard orders data
router.get("/dashboard", getDashboardOrders);

// dashboard recent-order
router.get("/dashboard-recent-order", getDashboardRecentOrder);

// dashboard order count
router.get("/dashboard-count", getDashboardCount);

// dashboard order amount
router.get("/dashboard-amount", getDashboardAmount);

// chart data for product
router.get("/best-seller/chart", getBestSellerProductChart);

//get all order by a user
router.get("/customer/:id", getOrderCustomer);

//get a order by id
router.get("/:id", getOrderById);

//update a order
router.put("/:id", updateOrder);

//delete a order
router.delete("/:id", deleteOrder);

router.get("/get-all/food-order", getAllFoodOrders);

router.get("/get-All/user-Subscription", userSubscription);

// Search orders with filters
router.get("/get-All/user-Subscription/search", searchUserSubscriptions);

module.exports = router;
