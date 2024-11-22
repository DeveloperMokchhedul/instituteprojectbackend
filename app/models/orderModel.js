import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    totalprice: {
        type: Number, 
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending',
    },
    bookId:{
        type:[String],
        required:true
    },
    book: {
        type: [String], 
        required: true
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
});

export const Order = mongoose.model('Order', orderSchema);
