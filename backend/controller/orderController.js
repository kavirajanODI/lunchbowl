const Order = require("../models/Order");
const UserMeal = require("../models/UserMeal");
const Form = require("../models/Form");
const Subscription = require("../models/subscriptionModel");

const Child = require("../models/childModel");

const UserPayment = require("../models/Payment");

const getAllOrders = async (req, res) => {
  const {
    day,
    status,
    page,
    limit,
    method,
    endDate,
    // download,
    // sellFrom,
    startDate,
    customerName,
  } = req.query;

  //  day count
  let date = new Date();
  const today = date.toString();
  date.setDate(date.getDate() - Number(day));
  const dateTime = date.toString();

  const beforeToday = new Date();
  beforeToday.setDate(beforeToday.getDate() - 1);
  // const before_today = beforeToday.toString();

  const startDateData = new Date(startDate);
  startDateData.setDate(startDateData.getDate());
  const start_date = startDateData.toString();

  // console.log(" start_date", start_date, endDate);

  const queryObject = {};

  if (!status) {
    queryObject.$or = [
      { status: { $regex: `Pending`, $options: "i" } },
      { status: { $regex: `Processing`, $options: "i" } },
      { status: { $regex: `Delivered`, $options: "i" } },
      { status: { $regex: `Cancel`, $options: "i" } },
    ];
  }

  if (customerName) {
    queryObject.$or = [
      { "user_info.name": { $regex: `${customerName}`, $options: "i" } },
      { invoice: { $regex: `${customerName}`, $options: "i" } },
    ];
  }

  if (day) {
    queryObject.createdAt = { $gte: dateTime, $lte: today };
  }

  if (status) {
    queryObject.status = { $regex: `${status}`, $options: "i" };
  }

  if (startDate && endDate) {
    queryObject.updatedAt = {
      $gt: start_date,
      $lt: endDate,
    };
  }
  if (method) {
    queryObject.paymentMethod = { $regex: `${method}`, $options: "i" };
  }

  const pages = Number(page) || 1;
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    // total orders count
    const totalDoc = await Order.countDocuments(queryObject);
    const orders = await Order.find(queryObject)
      .select(
        "_id invoice paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt"
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    let methodTotals = [];
    if (startDate && endDate) {
      // console.log("filter method total");
      const filteredOrders = await Order.find(queryObject, {
        _id: 1,
        // subTotal: 1,
        total: 1,

        paymentMethod: 1,
        // createdAt: 1,
        updatedAt: 1,
      }).sort({ updatedAt: -1 });
      for (const order of filteredOrders) {
        const { paymentMethod, total } = order;
        const existPayment = methodTotals.find(
          (item) => item.method === paymentMethod
        );

        if (existPayment) {
          existPayment.total += total;
        } else {
          methodTotals.push({
            method: paymentMethod,
            total: total,
          });
        }
      }
    }

    res.send({
      orders,
      limits,
      pages,
      totalDoc,
      methodTotals,
      // orderOverview,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ _id: -1 });
    res.send(orders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    // console.log("getOrderById");

    const order = await Order.findById(req.params.id);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateOrder = (req, res) => {
  const newStatus = req.body.status;
  Order.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "Order Updated Successfully!",
        });
      }
    }
  );
};

const deleteOrder = (req, res) => {
  Order.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Order Deleted Successfully!",
      });
    }
  });
};

// get dashboard recent order
const getDashboardRecentOrder = async (req, res) => {
  try {
    // console.log("getDashboardRecentOrder");

    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const queryObject = {};

    queryObject.$or = [
      { status: { $regex: `Pending`, $options: "i" } },
      { status: { $regex: `Processing`, $options: "i" } },
      { status: { $regex: `Delivered`, $options: "i" } },
      { status: { $regex: `Cancel`, $options: "i" } },
    ];

    const totalDoc = await Order.countDocuments(queryObject);

    // query for orders
    const orders = await Order.find(queryObject)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    // console.log('order------------<', orders);

    res.send({
      orders: orders,
      page: page,
      limit: limit,
      totalOrder: totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get dashboard count
const getDashboardCount = async (req, res) => {
  try {
    // console.log("getDashboardCount");

    const totalDoc = await Order.countDocuments();

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total processing order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.send({
      totalOrder: totalDoc,
      totalPendingOrder: totalPendingOrder[0] || 0,
      totalProcessingOrder: totalProcessingOrder[0]?.count || 0,
      totalDeliveredOrder: totalDeliveredOrder[0]?.count || 0,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDashboardAmount = async (req, res) => {
  // console.log('total')
  let week = new Date();
  week.setDate(week.getDate() - 10);

  // console.log('getDashboardAmount');

  const currentDate = new Date();
  currentDate.setDate(1); // Set the date to the first day of the current month
  currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

  const lastMonthStartDate = new Date(currentDate); // Copy the current date
  lastMonthStartDate.setMonth(currentDate.getMonth() - 1); // Subtract one month

  let lastMonthEndDate = new Date(currentDate); // Copy the current date
  lastMonthEndDate.setDate(0); // Set the date to the last day of the previous month
  lastMonthEndDate.setHours(23, 59, 59, 999); // Set the time to the end of the day

  try {
    // total order amount
    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$total",
          },
        },
      },
    ]);
    // console.log('totalAmount',totalAmount)
    const thisMonthOrderAmount = await Order.aggregate([
      {
        $project: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
          total: 1,
          subTotal: 1,
          discount: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
        },
      },
      {
        $match: {
          $or: [{ status: { $regex: "Delivered", $options: "i" } }],
          year: { $eq: new Date().getFullYear() },
          month: { $eq: new Date().getMonth() + 1 },
          // $expr: {
          //   $eq: [{ $month: "$updatedAt" }, { $month: new Date() }],
          // },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$updatedAt",
            },
          },
          total: {
            $sum: "$total",
          },
          subTotal: {
            $sum: "$subTotal",
          },

          discount: {
            $sum: "$discount",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const lastMonthOrderAmount = await Order.aggregate([
      {
        $project: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
          total: 1,
          subTotal: 1,
          discount: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
        },
      },
      {
        $match: {
          $or: [{ status: { $regex: "Delivered", $options: "i" } }],

          updatedAt: { $gt: lastMonthStartDate, $lt: lastMonthEndDate },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$updatedAt",
            },
          },
          total: {
            $sum: "$total",
          },
          subTotal: {
            $sum: "$subTotal",
          },

          discount: {
            $sum: "$discount",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // console.log("thisMonthlyOrderAmount ===>", thisMonthlyOrderAmount);

    // order list last 10 days
    const orderFilteringData = await Order.find(
      {
        $or: [{ status: { $regex: `Delivered`, $options: "i" } }],
        updatedAt: {
          $gte: week,
        },
      },

      {
        paymentMethod: 1,
        paymentDetails: 1,
        total: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    res.send({
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      thisMonthlyOrderAmount: thisMonthOrderAmount[0]?.total,
      lastMonthOrderAmount: lastMonthOrderAmount[0]?.total,
      ordersData: orderFilteringData,
    });
  } catch (err) {
    // console.log('err',err)
    res.status(500).send({
      message: err.message,
    });
  }
};

const getBestSellerProductChart = async (req, res) => {
  try {
    // console.log("getBestSellerProductChart");

    const totalDoc = await Order.countDocuments({});
    const bestSellingProduct = await Order.aggregate([
      {
        $unwind: "$cart",
      },
      {
        $group: {
          _id: "$cart.title",

          count: {
            $sum: "$cart.quantity",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 4,
      },
    ]);

    res.send({
      totalDoc,
      bestSellingProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDashboardOrders = async (req, res) => {
  const { page, limit } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  let week = new Date();
  week.setDate(week.getDate() - 10);

  const start = new Date().toDateString();

  // (startDate = '12:00'),
  //   (endDate = '23:59'),
  // console.log("page, limit", page, limit);

  try {
    const totalDoc = await Order.countDocuments({});

    // query for orders
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$total",
          },
        },
      },
    ]);

    // total order amount
    const todayOrder = await Order.find({ createdAt: { $gte: start } });

    // this month order amount
    const totalAmountOfThisMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    //weekly sale report
    // filter order data
    const weeklySaleReport = await Order.find({
      $or: [{ status: { $regex: `Delivered`, $options: "i" } }],
      createdAt: {
        $gte: week,
      },
    });

    res.send({
      totalOrder: totalDoc,
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      todayOrder: todayOrder,
      totalAmountOfThisMonth:
        totalAmountOfThisMonth.length === 0
          ? 0
          : parseFloat(totalAmountOfThisMonth[0].total).toFixed(2),
      totalPendingOrder:
        totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0],
      totalProcessingOrder:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      totalDeliveredOrder:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      orders,
      weeklySaleReport,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllFoodOrders = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Fetch all user meals
    const userMeals = await UserMeal.find({}).lean();

    // ✅ Collect all userIds and childIds across plans
    const userChildPairs = [];
    userMeals.forEach((userMeal) => {
      if (!userMeal.plans) return;
      userMeal.plans.forEach((plan) => {
        if (!plan.children) return;
        plan.children.forEach((childEntry) => {
          if (!childEntry.childId) return;
          userChildPairs.push({
            userId: userMeal.userId.toString(),
            childId: childEntry.childId.toString(),
          });
        });
      });
    });

    // ✅ Get all unique child IDs
    const childIds = [...new Set(userChildPairs.map((p) => p.childId))];

    // ✅ Fetch all relevant child details
    const children = await Child.find({ _id: { $in: childIds } }).lean();

    // ✅ Map childId → childDetails
    const childDetailsMap = {};
    children.forEach((child) => {
      childDetailsMap[child._id.toString()] = child;
    });

    // ✅ Today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Flatten and enrich all orders
    let orders = [];
    userMeals.forEach((userMeal) => {
      const userId = userMeal.userId?.toString();
      if (!userMeal.plans) return;

      userMeal.plans.forEach((plan) => {
        if (!plan.children) return;

        plan.children.forEach((childEntry) => {
          const childId = childEntry.childId?.toString();
          if (!childEntry.meals || !childId) return;

          const childDetails = childDetailsMap[childId];
          childEntry.meals.forEach((meal) => {
            if (!meal.mealDate || !meal.mealName) return;

            // Include only meals from today onwards
            if (new Date(meal.mealDate) >= today) {
              orders.push({
                userId,
                planId: plan.planId,
                childId,
                date: meal.mealDate,
                food: meal.mealName,
                // Enriched details
                childFirstName: childDetails?.childFirstName || "",
                childLastName: childDetails?.childLastName || "",
                school: childDetails?.school || "",
                lunchTime: childDetails?.lunchTime || "",
                location: childDetails?.location || "",
                childClass: childDetails?.childClass || "",
                section: childDetails?.section || "",
              });
            }
          });
        });
      });
    });

    // ✅ Sort by date ascending
    orders.sort((a, b) => new Date(a.date) - new Date(b.date));

    // ✅ Pagination
    const paginatedOrders = orders.slice(skip, skip + limit);

    // ✅ Send response
    res.status(200).json({
      orders: paginatedOrders,
      total: orders.length,
      page,
      limit,
    });
  } catch (err) {
    console.error("❌ Error in getAllFoodOrders:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// ADD THIS FUNCTION TO THIS FILE
const searchOrders = async (req, res) => {
  try {
    const { childName = "", date = "", page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch all user meals
    const userMeals = await UserMeal.find({}).lean();

    // Collect all unique userIds and childIds
    const userChildPairs = [];
    userMeals.forEach((userMeal) => {
      if (!userMeal.plans) return;
      userMeal.plans.forEach((plan) => {
        if (!plan.children) return;
        plan.children.forEach((childEntry) => {
          if (!childEntry.childId) return;
          userChildPairs.push({
            userId: userMeal.userId.toString(),
            childId: childEntry.childId.toString(),
          });
        });
      });
    });

    const userIds = [...new Set(userChildPairs.map((p) => p.userId))];
    const childIds = [...new Set(userChildPairs.map((p) => p.childId))];

    // Fetch all relevant child details in one go
    const children = await Child.find({ _id: { $in: childIds } }).lean();

    // Map for quick access
    const childDetailsMap = {};
    children.forEach((child) => {
      childDetailsMap[child._id.toString()] = child;
    });

    // Today's date at midnight (for filtering)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Flatten and enrich all orders
    let orders = [];
    userMeals.forEach((userMeal) => {
      const userId = userMeal.userId?.toString();
      if (!userMeal.plans) return;

      userMeal.plans.forEach((plan) => {
        if (!plan.children) return;

        plan.children.forEach((childEntry) => {
          const childId = childEntry.childId?.toString();
          if (!childEntry.meals || !childId) return;

          const childDetails = childDetailsMap[childId];
          childEntry.meals.forEach((meal) => {
            if (!meal.mealDate || !meal.mealName) return;

            // ❗ Skip deleted meals
            if (meal.deleted) return;

            // Include only meals from today onwards
              orders.push({
                userId,
                planId: plan.planId,
                childId,
                date: meal.mealDate,
                food: meal.mealName,
                childFirstName: childDetails?.childFirstName || "",
                childLastName: childDetails?.childLastName || "",
                school: childDetails?.school || "",
                lunchTime: childDetails?.lunchTime || "",
                location: childDetails?.location || "",
                childClass: childDetails?.childClass || "",
                section: childDetails?.section || "",
              });
          });
        });
      });
    });

    // Filter by child name (case-insensitive)
    if (childName) {
      const lowerChildName = childName.toLowerCase();
      orders = orders.filter((order) =>
        (order.childFirstName + " " + order.childLastName)
          .toLowerCase()
          .includes(lowerChildName)
      );
    }

    // Filter by date (exact match)
    let dishSummary = [];
    if (date) {
      const dateStr = new Date(date).toLocaleDateString();
      orders = orders.filter(
        (order) => new Date(order.date).toLocaleDateString() === dateStr
      );

      // Dish summary for this date
      const dishCountMap = {};
      orders.forEach((order) => {
        dishCountMap[order.food] = (dishCountMap[order.food] || 0) + 1;
      });

      dishSummary = Object.entries(dishCountMap).map(([dish, count]) => ({
        dish,
        count,
      }));
    }

    // Sort by date ascending
    orders.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Pagination
    const paginatedOrders = orders.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      orders: paginatedOrders,
      total: orders.length,
      page: parseInt(page),
      limit: parseInt(limit),
      dishSummary,
    });
  } catch (err) {
    console.error("Error in searchOrders:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};


const userSubscription = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const today = new Date();

    const paidUsers = await UserPayment.find(
      {
        "payments.order_status": "Success"
      },
      { user: 1 }
    ).lean();

    const paidUserIds = paidUsers.map(p => p.user);


    const activeValidFilter = {
      status: { $in: ["active", "upcoming"] },
      endDate: { $gte: today },
      user: { $in: paidUserIds }
    };


    // 1️⃣ Fetch ACTIVE subscriptions
    const total = await Subscription.countDocuments(activeValidFilter);

    const subscriptions = await Subscription.find(activeValidFilter)
      .populate("children")
      .populate("user") // may be ObjectId OR populated object
      .skip(skip)
      .limit(limit)
      .lean();

    // 2️⃣ Extract userIds safely
    const userIds = subscriptions
      .map(sub => {
        if (!sub.user) return null;
        return typeof sub.user === "object"
          ? sub.user._id
          : sub.user;
      })
      .filter(Boolean);

    // 3️⃣ Fetch Forms
    const forms = await Form.find({
      user: { $in: userIds },
      step: 4, // ✅ ONLY step 4 users
    })
      .select("user parentDetails paymentStatus step")
      .lean();


    // 4️⃣ Build lookup map
    const formMap = {};
    forms.forEach(form => {
      formMap[form.user.toString()] = form;
    });

    // 5️⃣ Final response
    const result = subscriptions
      .map(sub => {
        if (!sub.user) return null;

        const userId =
          typeof sub.user === "object"
            ? sub.user._id.toString()
            : sub.user.toString();

        const form = formMap[userId];
        if (!form) return null; // no form → skip safely

        return {
          parentDetails: {
            name: `${form.parentDetails?.fatherFirstName || ""} ${form.parentDetails?.fatherLastName || ""}`.trim(),
            mobile: form.parentDetails?.mobile || "",
            email: form.parentDetails?.email || "",
            address: form.parentDetails?.address || "",
            city: form.parentDetails?.city || "",
            state: form.parentDetails?.state || "",
            country: form.parentDetails?.country || "India",
            pincode: form.parentDetails?.pincode || "",
          },

          subscriptionDetails: {
            planId: sub.planId,
            startDate: sub.startDate,
            endDate: sub.endDate,
            workingDays: sub.workingDays,
            price: sub.price,
            status: sub.status,
            paymentAmount: sub.paymentAmount || null,
            paymentDate: sub.paymentDate || null,
            paymentMethod: sub.paymentMethod,
            transactionId: sub.transactionId || null,
          },

          children: (sub.children || []).map(child => ({
            childId: child._id,
            name: `${child.childFirstName} ${child.childLastName}`,
            dob: child.dob,
            lunchTime: child.lunchTime,
            school: child.school,
            location: child.location,
            class: child.childClass,
            section: child.section,
            allergies: child.allergies || "",
          })),

          paymentStatus: form.paymentStatus || "",
          step: form.step || null,
        };
      })
      .filter(Boolean); // 🔥 remove null entries safely

    return res.status(200).json({
      total,
      page,
      limit,
      subscriptions: result,
    });

  } catch (error) {
    console.error("Error in userSubscription:", error);
    return res.status(500).json({ message: error.message });
  }
};


// Add this to your controller file (or wherever you keep userSubscription)
const searchUserSubscriptions = async (req, res) => {
  try {
    const {
      fatherName = "",
      mobile = "",
      email = "",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const today = new Date();

    const paidUsers = await UserPayment.find(
      {
        "payments.order_status": "Success"
      },
      { user: 1 }
    ).lean();

    const paidUserIds = paidUsers.map(p => p.user);

    const activeValidFilter = {
      status: { $in: ["active", "upcoming"] },
      endDate: { $gte: today }, // 🔥 exclude expired subscriptions
      user: { $in: paidUserIds }
    };


    // 1️⃣ Fetch ACTIVE subscriptions
    const subscriptions = await Subscription.find(activeValidFilter)
      .populate("children")
      .populate("user") // may be ObjectId or populated
      .lean();

    // 2️⃣ Extract userIds safely
    const userIds = subscriptions
      .map((sub) => {
        if (!sub.user) return null;
        return typeof sub.user === "object" ? sub.user._id : sub.user;
      })
      .filter(Boolean);

    // 3️⃣ Build Form filter
    const formFilter = {
      user: { $in: userIds },
      step: 4, // 🔥 IMPORTANT
    };

    if (mobile) {
      formFilter["parentDetails.mobile"] = { $regex: mobile, $options: "i" };
    }

    if (email) {
      formFilter["parentDetails.email"] = { $regex: email, $options: "i" };
    }

    // 4️⃣ Fetch Forms
    let forms = await Form.find(formFilter)
      .select("user parentDetails paymentStatus step")
      .lean();

    // 5️⃣ Father name filter (full name → in-memory)
    if (fatherName) {
      const search = fatherName.toLowerCase();
      forms = forms.filter((form) => {
        const fullName = `${form.parentDetails?.fatherFirstName || ""} ${form.parentDetails?.fatherLastName || ""
        }`.trim();
        return fullName.toLowerCase().includes(search);
      });
    }

    // 6️⃣ Create form lookup map
    const formMap = {};
    forms.forEach((form) => {
      formMap[form.user.toString()] = form;
    });

    // 7️⃣ Merge Subscription + Form + Child
    const merged = subscriptions
      .map((sub) => {
        if (!sub.user) return null;

        const userId =
          typeof sub.user === "object"
            ? sub.user._id.toString()
            : sub.user.toString();

        const form = formMap[userId];
        if (!form) return null;

        return {
          parentDetails: {
            name: `${form.parentDetails?.fatherFirstName || ""} ${form.parentDetails?.fatherLastName || ""
              }`.trim(),
            mobile: form.parentDetails?.mobile || "",
            email: form.parentDetails?.email || "",
            address: form.parentDetails?.address || "",
            city: form.parentDetails?.city || "",
            state: form.parentDetails?.state || "",
            country: form.parentDetails?.country || "India",
            pincode: form.parentDetails?.pincode || "",
          },

          subscriptionDetails: {
            planId: sub.planId,
            startDate: sub.startDate,
            endDate: sub.endDate,
            workingDays: sub.workingDays,
            price: sub.price,
            status: sub.status,
            paymentAmount: sub.paymentAmount || null,
            paymentDate: sub.paymentDate || null,
            paymentMethod: sub.paymentMethod,
            transactionId: sub.transactionId || null,
          },

          children: (sub.children || []).map((child) => ({
            childId: child._id,
            name: `${child.childFirstName} ${child.childLastName}`,
            school: child.school,
            class: child.childClass,
            section: child.section,
            lunchTime: child.lunchTime,
            allergies: child.allergies || "",
          })),

          paymentStatus: form.paymentStatus || "",
          step: form.step || null,
        };
      })
      .filter(Boolean);

    // 8️⃣ Pagination (after filtering)
    const total = merged.length;
    const paginated = merged.slice(skip, skip + limitNum);

    return res.status(200).json({
      subscriptions: paginated,
      total,
      page: pageNum,
      limit: limitNum,
    });

  } catch (error) {
    console.error("Error in searchUserSubscriptions:", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllOrders,
  getOrderById,
  getOrderCustomer,
  updateOrder,
  deleteOrder,
  getBestSellerProductChart,
  getDashboardOrders,
  getDashboardRecentOrder,
  getDashboardCount,
  getDashboardAmount,
  getAllFoodOrders,
  searchOrders,
  userSubscription,
  searchUserSubscriptions,
};
