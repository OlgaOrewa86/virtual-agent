import express from "express";
import { eventsController } from "../controllers/eventsController.js";

const router = express.Router();

router.get("/", eventsController);

export default router;
