import { asyncHandler } from "../utility/AsyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/product.model.js";

const createOrder = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    district,
    city,
    zip,
    phone,
    book,
    bookId,
    totalprice,
  } = req.body;

  console.log(name, email, district,city, zip, phone, book, bookId, totalprice);
  

  if (
    !name &&
    !email &&
    !district &&
    !city &&
    !zip &&
    !phone &&
    !book &&
    !bookId &&
    !totalprice
  ) {
    throw new ApiError(500, "all field ar required !!!!");
  }
  const newOrder = await Order.create({
    name,
    email,
    district,
    city,
    zip,
    phone,
    book,
    bookId,
    totalprice,
    orderby: req.user,
  });
  return res.status(201).json(
    {
      message: "order placed successfully",
      newOrder,
    }
    //   new ApiResponse(201, registerProduct, "order created successfully")
  );
});

const findOrderById = asyncHandler(async (req, res) => {
    const id = req.user._id;
    if (!id) {
      throw new ApiError(404, "order not found");
    }
  
    const allOrder = await Order.find({ orderby:id }).populate("orderby");
  
    return res.json(
      new ApiResponse(201, allOrder, "order found")
    );
  });


  



  const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    
    
  
    if (!id.trim()) {
      throw new ApiError(404, "order missiong missing");
    }
  
    const order = await Order.findById(id);
  
    if (!order) {
      throw new ApiError(400, "order not found in db");
    }
  
  
    const removeOrder = await Order.findByIdAndDelete(id);
  
    if (!removeOrder) {
      throw new ApiError(500, "something went wrong while deleting product");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, [], "order deleted successfully"));
  });
  




  const AllOrder = asyncHandler(async (req, res) => {
  
    const allOrder = await Order.find();
  
    return res.json(
      new ApiResponse(201, allOrder, "order found")
    );
  });



  const getMyProductOrders = asyncHandler(async (req, res) => {

    const ownerId = req.user._id;

    const myProducts = await Product.find({ productOwner: ownerId });

    
  

    const productIds = myProducts.map(product => product._id);

    
  
  
    const myOrders = await Order.find({ bookId: { $in: productIds } });

    
    
    
  
    if (!myOrders.length) {
      return res.status(404).json({ message: "No orders found for your products" });
    }
  
    return res.status(200).json({ message: "Orders found", myOrders });
  });
  
  const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

  
    const allowedStatuses = ['pending', 'shipped', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
  
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
  
    // Update order status
    order.status = status;
    await order.save();
  
    // If status is delivered, update the product to isSold: true
    if (status === 'delivered') {
      const product = await Product.findById(order.bookId);
      console.log("product is ", product);
      
      if (product) {
        product.isSold = true;
        await product.save();
      }
    }
  
    return res.status(200).json({
      message: "Order status updated successfully",
      updatedOrder: order,
    });
  });
  






  
export { createOrder,deleteOrder,findOrderById,getMyProductOrders,AllOrder, updateOrderStatus };
