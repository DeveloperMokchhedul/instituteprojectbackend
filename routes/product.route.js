import { Router } from "express";
import { getAllProduct, getNewReleaseProduct, getProductById, registerProduct } from "../app/controllers/product.controller.js";
import { upload } from "../app/utility/multer.js";
import { isAuthenticate } from "../app/middlewares/auth.middleware.js";
import { isSeller } from "../app/middlewares/isSeller.js";


const router = Router();

router.post("/addproduct",isAuthenticate,isSeller,upload.fields([{ name: "productImage", maxCount: 1 }]),  registerProduct);
router.get("/releaseProduct", getNewReleaseProduct);
router.get("/allproduct", getAllProduct);
router.get("/singleproduct/:productId", getProductById);

export default router;
