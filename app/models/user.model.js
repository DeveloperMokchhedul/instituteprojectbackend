import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type: String,
        required: true,
        index:true
    },
    password:{
        type: String,
        required: true,
        trim : true,
        index:true  
    },
    role:{
        type:String,
        required:true,
        enum:["seller","user"],
        default:"user"
    },
    image:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    }
},{
   timestamps:true 
})

userSchema.pre("save",async function(next){
    console.log("password1")
    if(!this.isModified("password")) return next()
      this.password= await bcrypt.hash(this.password, 10)
      next()

})

userSchema.methods.isPasswordCorrect = async function (password){
   return  await bcrypt.compare(password,this.password)
}




userSchema.methods.generateToken =function(){
    return jwt.sign(
        {
            //payload:
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        //token secret
        "mokchhedulislam"
        
        ,
        {
           expiresIn: "7day"
            //expiry 
        }
    )
}



export const User = mongoose.model('User',userSchema)
