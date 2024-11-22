import mongoose from "mongoose";

const productShema = mongoose.Schema({

    bookname:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },  
    semister:{
        type:String,
        required:true,
    },  
    department:{
        type:String,
        required:true,
    },  
    description:{
        type:String
    },  

    productImage:{
        type:String,
        required: true,
    },
    isSold: { type: Boolean, default: false },

    productOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    
},{
    timestamps:true, 
})

export const Product = mongoose.model('Product',productShema)


