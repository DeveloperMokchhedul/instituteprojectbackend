import { Router } from "express";
import { AllOrder, createOrder, deleteOrder, findOrderById, getMyProductOrders, updateOrderStatus } from "../app/controllers/orderController.js";
import { isAuthenticate } from "../app/middlewares/auth.middleware.js";


const router = Router();

router.post("/addorder",isAuthenticate, createOrder);
router.get("/find",isAuthenticate, findOrderById);
router.get("/all", AllOrder);
router.get("/findbyowner",isAuthenticate, getMyProductOrders);
router.delete("/delete/:id", deleteOrder);
router.patch("/orders/:orderId/status",isAuthenticate, updateOrderStatus);


export default router;
