import { Router } from "express";
import fs from "fs";

import { upload } from "../middlewares/multer.middleware.js";
import { createEvent, deleteEvent, getEventById, getLatestEvents, updateEvent } from "../controllers/event.controller.js";

const router = Router();

router.route('/events')
    .post(upload.single("image"),createEvent)
    .get(getEventById)
    .get(getLatestEvents)

router.route('/events/:id')
    .put(upload.single("image"),updateEvent)
    .delete(deleteEvent)

export default router;