import express from "express";
import { orderController } from "../controllers/orderController.js";

const router = express.Router();

router.get("/:id", orderController);

export default router;
