import express from "express";
import {LeaveController,getAllleaves,getLeavesById,getLeavesDeatil,updateLeave} from "../controller/LeaveController.js"; // Add `.js` if using ES Modules

const router = express.Router();
router.post("/add", LeaveController);
router.get("/by/:id", getLeavesById);
router.get("/detail/:id", getLeavesDeatil);
router.get("/",getAllleaves ) // onely leave ka hai 
router.put("/:id", updateLeave) // that means approved or reject 
export default router;
