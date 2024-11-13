import { Router } from "express";
import { getAllProduct, getProductById, registerProduct } from "../app/controllers/product.controller.js";
import { upload } from "../app/utility/multer.js";
import { isAuthenticate } from "../app/middlewares/auth.middleware.js";
import { isAdmin } from "../app/middlewares/isAdmin.js";

const router = Router();

router.post("/addproduct",isAuthenticate,isAdmin, upload.fields([{ name: "productImage", maxCount: 1 }]),  registerProduct);
router.get("/allproduct",isAuthenticate, getAllProduct);
router.get("/singleproduct/:productId", getProductById);

export default router;
