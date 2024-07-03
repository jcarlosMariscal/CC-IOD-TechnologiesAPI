import multer from "multer";

const storage = multer.memoryStorage();

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
    fileSize: 20000000, // 5 MB
  },
});
export const uploadContractFile = upload.single("contract");
export const uploadReportFile = upload.single("installation_report");
