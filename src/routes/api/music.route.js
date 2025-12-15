import { Router } from "express";
import { uploadMp3 } from "../../middlewares/upload.js";
import {
  listMusics,
  getOneMusic,
  createOneMusic,
  updateOneMusic,
  deleteOneMusic
} from "../../controllers/music.controller.js";

const router = Router();

router.get("/", listMusics);
router.get("/:musicId", getOneMusic);
router.post("/", uploadMp3.single("file"), createOneMusic);

router.patch("/:musicId", updateOneMusic);
router.delete("/:musicId", deleteOneMusic);

export default router;