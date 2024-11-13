import mongoose from "mongoose";

const productShema = mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },    
    productImage:{
        type:String,//cloudinary url
        required: true,
    },
    productOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"

    }
},{
    timestamps:true, 
})

export const Product = mongoose.model('Product',productShema)


