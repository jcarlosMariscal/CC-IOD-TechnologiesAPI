import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    const basename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    cb(null, basename + "-cciod" + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Only PDF files are allowed"
        )
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5000000, // 5 MB
  },
});

export const uploadFiles = upload.fields([
  { name: "contract", maxCount: 1 },
  { name: "installation_report", maxCount: 1 },
]);
