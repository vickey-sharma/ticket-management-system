import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },

  // filename: function (req, file, cb) {
  //   // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  //   // cb(null, file.fieldname + '-' + uniqueSuffix)
  //   cb(null, file.originalname)
  //   //  cb(null, Date.now() + "-" + file.originalname);
  //   console.log(`multer middleware cb : ${file.originalname}`)
  //   console.log(`multer middleware cb : ${file}`)
  // }

  //MAKE FILENAME UNIQUE
  
  filename: function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();

  const uniqueName =
    `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;

  cb(null, uniqueName);
}

}); 

const excelFileFilter = (req, file, cb) => {
    const allowedExtensions = [".xlsx", ".xls"];

    // Additional file type validation using MIME type
       const allowedMimeTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!allowedExtensions.includes(extension) || !allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error("Only Excel files (.xlsx, .xls) are allowed")
        );
    }

    cb(null, true);
};

const imageFileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

   // Additional file type validation using MIME type
    const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!allowedExtensions.includes(extension) || !allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error(
                "Only image files (.jpg, .jpeg, .png, .webp) are allowed"
            )
        );
    }

    cb(null, true);
};

export const uploadExcel = multer({
    storage,
    fileFilter: excelFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export const uploadImage = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});