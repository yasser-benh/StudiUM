import multer from "multer";
import path from "path";



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../uploads/avatars"); 
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});


const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Ce fichier n'est pas une image !"), false);
    }
};

// Middleware Multer
const upload = multer({ storage, fileFilter });

export default upload;
