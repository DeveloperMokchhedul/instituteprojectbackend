import multer from "multer";
import fs from "fs";

const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = "./upload";
        createFolderIfNotExists(folderPath); 
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); 
    },
});

export const upload = multer({ storage: storage });


















// import multer from "multer"


// // file
// const storage = multer.diskStorage({
//     //to upload file on destionation
//     destination:function(req,file,cb){
//             cb(null,"/upload")
//     },

    


// //to configure file name 
//     filename: function(req,file,cb){
//         cb(null, file.originalname)
//     }
// })


// export const upload = multer({storage:storage})