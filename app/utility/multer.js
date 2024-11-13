import multer from "multer"


// file
const storage = multer.diskStorage({
    destination:function(req,file,cb){
            cb(null,"./upload")
    },

    


//to configure file name 
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})


export const upload = multer({storage:storage})