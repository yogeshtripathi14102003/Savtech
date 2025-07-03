// Server/Route/DashboardRoute.js
import express from "express";
import { DashController } from "../controller/DashController.js";

const router = express.Router();

router.get("/summary", DashController);

export default router;
