const express = require("express");
const router = express.Router();
const {
  multiUpload,
  handleUploadErrors,
} = require("../middleware/uploadMiddleware");
const path = require("path"); // Make sure this is at the top of your controller file
const fs = require("fs");

const {
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
} = require("../controller/productController");

//add a product
router.post("/add", addProduct);

//add multiple products
router.post("/all", addAllProducts);

//get a product
//router.post("/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get all products
router.get("/", getAllProducts);

router.get("/get-all-menu", getAllDishes);

router.get("/get-all-menu-dishes", getAllMenuDishes);

// Dish routes with upload middleware
router.post("/add-dish", multiUpload, handleUploadErrors, addDish);
router.put("/update-dish/:id", multiUpload, handleUploadErrors, updateDish);


//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.patch("/:id", updateProduct);

//update many products
router.patch("/update/many", updateManyProducts);

//update a product status
router.put("/status/:id", updateStatus);

//delete a product
router.delete("/:id", deleteProduct);

//delete many product
router.patch("/delete/many", deleteManyProducts);

module.exports = router;
