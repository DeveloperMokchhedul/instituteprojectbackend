import mongoose from "mongoose";

mongoose.connect().then(()=>console.log("db connected successfully")).catch((err)=>console.log(err)
)

const dbConnected =async ()=>{

    try {
        await mongoose.connect("mongodb+srv://mokchheduls46:mokchhedul@cluster0.cxqeo.mongodb.net/instituteproject?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
          console.log("MongoDB connected successfully.");
        
    } catch (error) {
        console.log(error);
        
        
    }

}

export  {dbConnected}