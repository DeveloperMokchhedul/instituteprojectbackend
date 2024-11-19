import { v2 as cloudinary } from "cloudinary";

import { asyncHandler } from "../utility/AsyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerProduct = asyncHandler(async (req, res) => {
  const { bookname, price, semister, department, description } = req.body;

  console.log(bookname, price, semister, department, description);

  if (!bookname && !price && !semister && !department && !description) {
    throw new ApiError("all field are required");
  }

  const productpath = req.files?.productImage[0]?.path;

  console.log(productpath);

  if (!productpath) {
    throw new ApiError(400, "product file is required");
  }

  const uploadProudct = await uploadOnCloudinary(productpath);

  if (!uploadProudct) {
    throw new ApiError(400, "upload product failure");
  }

  const owner = req.user;
  const product = await Product.create({
    productImage: uploadProudct?.url || "",
    bookname,
    price,
    semister,
    department,
    description,
    productOwner: owner,
  });

  const registerProduct = await Product.findById(product._id)
    .populate("productOwner")
    .select("-password");

  if (!registerProduct) {
    throw new ApiError(500, "something  ddddddddddd went wrong ");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, registerProduct, "product uploaded successfully")
    );
});

const getNewReleaseProduct = asyncHandler(async (req, res) => {
  const AllProduct = await Product.find();
  return res.status(200).json({
    message: "all product found",
    AllProduct,
  });
});

const getAllProduct = asyncHandler(async (req, res) => {
  const allProducts = await Product.aggregate([
    {
      $match: { productOwner: req.user._id },
    },
  ]);

  const totalProduct = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProduct: { $sum: 1 },
      },
    },
  ]);
  console.log("total product is ", totalProduct);

  console.log("allProduct is ", allProducts);

  const allProduct = await Product.find();
  res.status(200).json({
    message: "all product fined",
    allProduct,
  });
});




const findByOwner = asyncHandler(async(req,res)=>{

  const ownerId = req.user._id;

  if (!ownerId) {
    throw new ApiError(400, "Owner ID is missing");
  }

  const products = await Product.find({ productOwner: ownerId });

  if (!products.length) {
    throw new ApiError(404, "No products found for this owner");
  }
  return res
  .status(200)
  .json(new ApiResponse(200, products, "Product retrieved successfully"));

})





const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId.trim()) {
    throw new ApiError(404, "Product ID is missing");
  }

  const productData = await Product.findById(productId).populate(
    "productOwner"
  );
  console.log("productOwner Data is ", productData);
  
  

  if (!productData) {
    throw new ApiError(400, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, productData, "Product retrieved successfully"));
});







const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { title, description } = req.body;
  const productLocalPath = req.file.path;

  if (!title || !description | !productImage) {
    throw new ApiError(400, "All fields are required");
  }

  const productPhoto = await uploadOnCloudinary(productLocalPath);

  if (!productPhoto) {
    throw new ApiError(404, "something daaaaaa went wrong");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(400, "product not found");
  }

  const response = await cloudinary.uploader.destroy(Product.productImage);

  if (response) {
    console.log("old thumbnail deleted successfully");
  }

  const updateProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        title,
        description,
        productImage: productImage.url,
      },
    },
    {
      new: true,
    }
  );

  if (!updateProduct) {
    throw new ApiError(500, "something went wrong while updating");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateVideo, "product details updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  

  if (!id.trim()) {
    throw new ApiError(404, "product missiong missing");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(400, "product not found in db");
  }

  const response = await cloudinary.uploader.destroy(product.productImage);

  if (response) {
    console.log("product file deleted from cloudinary successfully");
  }

  const removeProduct = await Product.findByIdAndDelete(id);

  if (!removeProduct) {
    throw new ApiError(500, "something went wrong while deleting product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, [], "product deleted successfully"));
});

export {
  registerProduct,
  getNewReleaseProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  findByOwner
};