const express = require("express");
const { isAdmin } = require("../Middlewares/userAuthMiddleware");
const router = express.Router();
const Verify = require("../Utils/Verify");
const {
  addProduct,
  allProducts,
  deleteProduct,
  oneProduct,
  adminViewAllProducts,
  updateProduct,
} = require("../Controllers/ProductController");
const multerUpload = require("../Middlewares/MulterUpload");

router.post("/add", Verify, isAdmin, multerUpload.single("image"), addProduct);
router.get("/allProducts", allProducts);
router.get("/adminViewAllProducts", Verify, isAdmin, adminViewAllProducts);
router.delete("/deleteProduct/:id", Verify, isAdmin, deleteProduct);
router.get("/:id", Verify, oneProduct);
router.put(
  "/update-product/:id",
  Verify,
  isAdmin,
  multerUpload.single("image"),
  updateProduct
);

module.exports = router;
