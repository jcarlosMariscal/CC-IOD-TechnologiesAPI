import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;

    if (fs.existsSync(path.join("uploads", originalName))) {
      return cb(
        new Error(
          `Archivo "${originalName}" repetido. No es posible subir dos archivos con el mismo nombre al servidor.`
        ),
        ""
      );
    } else {
      cb(null, originalName);
    }
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

// export const uploadFiles = upload.fields([
//   { name: "contract", maxCount: 1 },
//   { name: "installation_report", maxCount: 1 },
// ]);
export const uploadContractFile = upload.fields([
  { name: "contract", maxCount: 1 },
]);
export const uploadReportFile = upload.fields([
  { name: "installation_report", maxCount: 1 },
]);
