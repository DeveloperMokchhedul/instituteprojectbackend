import { ApiError } from "../utility/ApiError.js";

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "User not registered");
    }
    
    if (req.user.role !== "seller") {
        throw new ApiError(403, "Only sellers can add products");
    }

    next();
};
