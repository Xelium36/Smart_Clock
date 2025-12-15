import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replaceAll(" ", "_");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  const okMime =
    file.mimetype === "audio/mpeg" ||
    file.mimetype === "audio/mp3" ||
    file.mimetype === "audio/x-mpeg";

  const okExt = ext === ".mp3";

  if (okMime || okExt) return cb(null, true);

  cb(new Error(`Only mp3 files are allowed (got mimetype=${file.mimetype}, ext=${ext})`), false);
}

export const uploadMp3 = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});
