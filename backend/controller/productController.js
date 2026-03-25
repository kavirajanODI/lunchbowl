const Product = require("../models/Product");
const Dish = require("../models/DishSchema");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const { languageCodes } = require("../utils/data");
const multer = require("multer");
const path = require("path"); // Make sure this is at the top of your controller file
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      // productId: cname + (count + 1),
      productId: req.body.productId
        ? req.body.productId
        : mongoose.Types.ObjectId(),
    });

    await newProduct.save();
    res.send(newProduct);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllProducts = async (req, res) => {
  try {
    // console.log('product data',req.body)
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      message: "Product Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "show" }).sort({ _id: -1 });
    res.send(products);
    // console.log("products", products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  const { title, category, price, page, limit } = req.query;

  // console.log("getAllProducts");

  let queryObject = {};
  let sortObject = {};
  if (title) {
    const titleQueries = languageCodes.map((lang) => ({
      [`title.${lang}`]: { $regex: `${title}`, $options: "i" },
    }));
    queryObject.$or = titleQueries;
  }

  if (price === "low") {
    sortObject = {
      "prices.originalPrice": 1,
    };
  } else if (price === "high") {
    sortObject = {
      "prices.originalPrice": -1,
    };
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gt: 0 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 1 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject = { _id: -1 };
  }

  // console.log('sortObject', sortObject);

  if (category) {
    queryObject.categories = category;
  }

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      products,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    // console.log("error", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllDishes = async (req, res) => {
  const { title, page, limit } = req.query;

  const queryObject = {};

  if (title && title !== "null") {
    queryObject.$or = [
      { primaryDishTitle: { $regex: title, $options: "i" } },
      { subDishTitle: { $regex: title, $options: "i" } },
    ];
  }

  const pages = Number(page) || 1;
  const limits = Number(limit) || 10;
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Dish.countDocuments(queryObject);

    const dishes = await Dish.find(queryObject)
      .sort({ _id: -1 }) // Default: newest first
      .skip(skip)
      .limit(limits);

    res.send({
      dishes,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


const getAllMenuDishes = async (req, res) => {
  try {
    const newDish = await Dish.find({});
    res.json(newDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addDish = async (req, res) => {
  try {
    // Validate required fields including nutritionValues (no ingredients check)
    if (!req.body.nutritionValues) {
      return res.status(400).json({
        error: "Nutrition values are required",
      });
    }
    // Main image required
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No main image uploaded" });
    }

    let nutritionValues = req.body.nutritionValues;
    if (typeof nutritionValues === "string") {
      nutritionValues = JSON.parse(nutritionValues);
    }

    const imagePath = `/uploads/${req.files.image[0].filename}`;
    const dishImage2Path =
      req.files.dishImage2 && req.files.dishImage2[0]
        ? `/uploads/${req.files.dishImage2[0].filename}`
        : null;

    const newDish = new Dish({
      ...req.body,
      nutritionValues,
      image: imagePath,
      dishImage2: dishImage2Path,
    });

    await newDish.save();

    const responseDish = newDish.toObject();
    responseDish.image = `${req.protocol}://${req.get("host")}${responseDish.image}`;
    responseDish.dishImage2 = responseDish.dishImage2
      ? `${req.protocol}://${req.get("host")}${responseDish.dishImage2}`
      : null;

    res.status(201).json(responseDish);
  } catch (error) {
    console.error("Add dish error:", error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};


const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Process nutritionValues if provided
    if (req.body.nutritionValues) {
      updateData.nutritionValues =
        typeof req.body.nutritionValues === "string"
          ? JSON.parse(req.body.nutritionValues)
          : req.body.nutritionValues;
    }

    // Handle new images uploaded and remove old images from disk
    if (req.files) {
      const oldDish = await Dish.findById(id);

      if (req.files.image && req.files.image[0]) {
        updateData.image = `/uploads/${req.files.image[0].filename}`;
        if (oldDish && oldDish.image) {
          const oldImagePath = path.join(__dirname, "../..", oldDish.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      if (req.files.dishImage2 && req.files.dishImage2[0]) {
        updateData.dishImage2 = `/uploads/${req.files.dishImage2[0].filename}`;
        if (oldDish && oldDish.dishImage2) {
          const oldImage2Path = path.join(__dirname, "../..", oldDish.dishImage2);
          if (fs.existsSync(oldImage2Path)) {
            fs.unlinkSync(oldImage2Path);
          }
        }
      }
    }

    const updatedDish = await Dish.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    // Return response with full image URLs
    const responseDish = updatedDish.toObject();
    responseDish.image = `${req.protocol}://${req.get("host")}${updatedDish.image}`;
    responseDish.dishImage2 = updatedDish.dishImage2
      ? `${req.protocol}://${req.get("host")}${updatedDish.dishImage2}`
      : null;

    res.status(200).json(responseDish);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const getProductBySlug = async (req, res) => {
  // console.log("slug", req.params.slug);
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "_id, name" })
      .populate({ path: "categories", select: "_id name" });

    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  // console.log('update product')
  // console.log('variant',req.body.variants)
  try {
    const product = await Product.findById(req.params.id);
    // console.log("product", product);

    if (product) {
      product.title = { ...product.title, ...req.body.title };
      product.description = {
        ...product.description,
        ...req.body.description,
      };

      product.productId = req.body.productId;
      product.sku = req.body.sku;
      product.barcode = req.body.barcode;
      product.slug = req.body.slug;
      product.categories = req.body.categories;
      product.category = req.body.category;
      product.show = req.body.show;
      product.isCombination = req.body.isCombination;
      product.variants = req.body.variants;
      product.stock = req.body.stock;
      product.prices = req.body.prices;
      product.image = req.body.image;
      product.tag = req.body.tag;

      await product.save();
      res.send({ data: product, message: "Product updated successfully!" });
    } else {
      res.status(404).send({
        message: "Product Not Found!",
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
    // console.log('err',err)
  }
};

const updateManyProducts = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        // console.log('req.body[key]', typeof req.body[key]);
        updatedData[key] = req.body[key];
      }
    }

    // console.log("updated data", updatedData);

    await Product.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );
    res.send({
      message: "Products update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
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
          message: `Product ${newStatus} Successfully!`,
        });
      }
    }
  );
};

const deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Product Deleted Successfully!",
      });
    }
  });
};

const getShowingStoreProducts = async (req, res) => {
  // console.log("req.body", req);
  try {
    const queryObject = { status: "show" };

    // console.log("getShowingStoreProducts");

    const { category, title, slug } = req.query;
    // console.log("title", title);

    // console.log("query", req);

    if (category) {
      queryObject.categories = {
        $in: [category],
      };
    }

    if (title) {
      const titleQueries = languageCodes.map((lang) => ({
        [`title.${lang}`]: { $regex: `${title}`, $options: "i" },
      }));

      queryObject.$or = titleQueries;
    }
    if (slug) {
      queryObject.slug = { $regex: slug, $options: "i" };
    }

    let products = [];
    let popularProducts = [];
    let discountedProducts = [];
    let relatedProducts = [];

    if (slug) {
      products = await Product.find(queryObject)
        .populate({ path: "category", select: "name _id" })
        .sort({ _id: -1 })
        .limit(100);
      relatedProducts = await Product.find({
        category: products[0]?.category,
      }).populate({ path: "category", select: "_id name" });
    } else if (title || category) {
      products = await Product.find(queryObject)
        .populate({ path: "category", select: "name _id" })
        .sort({ _id: -1 })
        .limit(100);
    } else {
      popularProducts = await Product.find({ status: "show" })
        .populate({ path: "category", select: "name _id" })
        .sort({ sales: -1 })
        .limit(20);

      discountedProducts = await Product.find({
        status: "show", // Ensure status "show" for discounted products
        $or: [
          {
            $and: [
              { isCombination: true },
              {
                variants: {
                  $elemMatch: {
                    discount: { $gt: "0.00" },
                  },
                },
              },
            ],
          },
          {
            $and: [
              { isCombination: false },
              {
                $expr: {
                  $gt: [
                    { $toDouble: "$prices.discount" }, // Convert the discount field to a double
                    0,
                  ],
                },
              },
            ],
          },
        ],
      })
        .populate({ path: "category", select: "name _id" })
        .sort({ _id: -1 })
        .limit(20);
    }

    res.send({
      products,
      popularProducts,
      relatedProducts,
      discountedProducts,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyProducts = async (req, res) => {
  try {
    const cname = req.cname;
    // console.log("deleteMany", cname, req.body.ids);

    await Product.deleteMany({ _id: req.body.ids });

    res.send({
      message: `Products Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
  getAllDishes,
  addDish,
  updateDish,
  getAllMenuDishes,
};
