import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf", // PDF
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX (Modern)
      "application/vnd.ms-powerpoint", // PPT (Jadul 97-2003)
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only PDF and PPT/PPTX are allowed."), false);
    }
  },
});

export const uploadMaterial = upload.single("file");
