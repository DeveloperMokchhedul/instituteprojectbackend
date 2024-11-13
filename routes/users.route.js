import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logOut, registerUser, updateAccountDetails, updateUserAvatar } from "../app/controllers/user.controllers.js";
import { upload } from "../app/utility/multer.js";
import { isAuthenticate } from "../app/middlewares/auth.middleware.js";



const router = Router();

router.post("/registration", upload.fields([{ name: "avatar", maxCount: 1 }]),  registerUser);
router.post("/login", loginUser);
router.get("/logout",isAuthenticate, logOut);


export default router;
