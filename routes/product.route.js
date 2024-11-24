import { Router } from "express";
import { deleteProduct, findByOwner, getAllProduct, getNewReleaseProduct, getProductById, registerProduct, updateProduct } from "../app/controllers/product.controller.js";
import { upload } from "../app/utility/multer.js";
import { isAuthenticate } from "../app/middlewares/auth.middleware.js";
import { isSeller } from "../app/middlewares/isSeller.js";


const router = Router();

router.post("/addproduct",isAuthenticate,isSeller,upload.fields([{ name: "productImage", maxCount: 1 }]),  registerProduct);
router.get("/releaseProduct", getNewReleaseProduct);
router.get("/allproduct", getAllProduct);
router.get("/products/by-owner", isAuthenticate,isSeller, findByOwner); 
router.get("/singleproduct/:productId", getProductById);
router.put("/update/:id",isAuthenticate,upload.fields([{ name: "productImage", maxCount: 1 }]), updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);

export default router;
