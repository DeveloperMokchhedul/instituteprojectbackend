
// import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from "../utility/ApiError.js"
import { ApiResponse } from "../utility/ApiResponse.js"
import { asyncHandler } from "../utility/AsyncHandler.js"
import { uploadOnCloudinary } from "../utility/cloudinary.js"


const registerUser = asyncHandler(async (req, res) => {

    const { name, email, phone, password, role } = req.body
    console.log(name, email, phone, password, role)
    if (!name && !email && !phone && !password && !role) {
        throw new ApiError(400, "all fields are required")
    }


    //3rd 
    const existedUser = await User.findOne({ email, role });

    if (existedUser) {
        throw new ApiError(400, "User with the same email and role already exists");
    }



    //4th step 

    const avatarLocalPath = req.files?.image[0]?.path


    console.log("local file path is", avatarLocalPath)


    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar not found")
    }



    const avatar = await uploadOnCloudinary(avatarLocalPath)


    if (!avatar) {
        throw new ApiError(400, "avatar from cludinar not found")
    }


    const user = await User.create({
        name: name,
        email,
        password,
        phone,
        image: avatar.url,
        role
    })


    const createdUser = await User.findById(user._id)

    if (!createdUser) {
        throw new ApiError(500, "data not found, something went wrong")
    }


    return res.status(201).json(
        new ApiResponse(201, createdUser, "user Registered successfully")
    )
})




const loginUser = asyncHandler(
    async (req, res) => {

        const { email, password } = req.body
        console.log(email, password);



        //2nd step
        if (!email || !password ) {
            throw new ApiError(400, "email and password  are required")
        }



        const user = await User.findOne({ email })


        //3rd step 
        if (!user) {
            throw new ApiError(404, "user is not found")
        }

        console.log(user);


        //4th step
        const isPasswordValid = await user.isPasswordCorrect(password)


        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password")
        }



        //5th step 



        const token = await user.generateToken()



        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        if (!loggedInUser) {
            throw new ApiError(500, "something went wrong ")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        }



        return res
            .status(200)
            .cookie("token", token, options)
            .json(
                new ApiResponse(200, {
                    user: loggedInUser,
                    token
                },
                    "user logged in successfully"
                ),

            )
    }
)


const logOut = asyncHandler(
    async (req, res) => {
        res.cookie("token", "").status(200).json({
            message: "user logout successfully"
        })
    }
)


const changeCurrentPassword = asyncHandler(
    async (req, res) => {
        const { oldPassword, newPassword, confirmPassword } = req.body

        if (newPassword != confirmPassword) {
            throw new ApiError(401, "confirmPassword isn't match with newpassword")
        }


        const user = await User.findById(req.user._id)

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid old Password")
        }

        user.password = newPassword
        await user.save({ validateBeforeSave: false })


        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "password updated successfully")
            )


    }
)


const getCurrentUser = asyncHandler(
    async (req, res) => {
        return res
            .status(200)
            .json(
                new ApiResponse(200, req.user, "current user fetched")
            )
    }
)



const updateAccountDetails = asyncHandler(
    async (req, res) => {
        const { fullName, email } = req.body
        if (!fullName && !email) {
            throw new ApiError(400, "All fields are required")
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName: fullName,
                    email: email
                }
            }, {
            new: true
        }
        ).select("-password ")

        if (!user) {
            throw new ApiError(500, "something went wrong in server")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, user, "Account details updated successfully")
            )


    }
)





const updateUserRole = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { role } = req.body;
  
    console.log("Received user ID:", _id, "and role:", role);
  
    // Validate role
    if (!role) {
      return res.status(400).json({ message: "Role is required." });
    }
    if (!["user", "seller"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
  
    // Find user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
  
    // Update and save role
    console.log("Current role:", user.role);
    user.role = role;
  
    try {
      await user.save();
      console.log("Updated role successfully:", user.role);
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).json({ message: "Failed to update role." });
    }
  
    // Return updated user
    return res.status(200).json({
      message: "Role updated successfully",
      updatedUser: user,
    });
  });
  












// const updateUserAvatar = asyncHandler(
//     async (req, res) => {
//         const avatarLocalPath = req.file?.path

//         if (!avatarLocalPath) {
//             throw new ApiError(404, "avatar file is not send")
//         }

//         const avatar = await uploadOnCloudinary(avatarLocalPath)

//         if (!avatar.url) {
//             throw new ApiError(500, "Error while uploading avatar on cloudinary")
//         }


//         const user = await User.findByIdAndUpdate(
//             req.user._id,
//             {
//                 $set: {
//                     avatar: avatar.url
//                 }
//             }, {
//             new: true
//         }
//         ).select("-password -refreshToken ")

//         if (!user) {
//             throw new ApiError(500, "something went wrong in server")
//         }

//         return res
//             .status(200)
//             .json(
//                 new ApiResponse(200, user, "avatar file uploaded successfully")
//             )

//     }
// )






// const updateUserRole = asyncHandler(async (req, res) => {
//     const {_id} = req.user
//     const { role } = req.body;

//     console.log("user id is", _id, "role is", role);

//     const user = await User.findById(_id);
//     console.log("user is ", user);

//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }
    
//      user.role = role;
//     await user.save();

//     console.log(user);
    

//     console.log("user is ", user);
//     return res.status(200).json({
//       message: "role updated successfully",
//       updatedUser: user,
//     });
//   });
  




export {
    registerUser, loginUser, logOut, changeCurrentPassword, getCurrentUser, updateAccountDetails,updateUserRole


}