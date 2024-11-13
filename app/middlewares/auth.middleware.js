import { ApiError } from "../utility/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utility/AsyncHandler.js";
import { User } from "../models/user.model.js";

export const isAuthenticate = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, "mokchhedulislam");

  const user = await User.findById(decodedToken?._id).select("-password");

  if (!user) {
    throw new ApiError(401, "Invalid token");
  }

  req.user = user;

  next()
});
