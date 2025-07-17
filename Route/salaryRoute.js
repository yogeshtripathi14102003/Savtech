import express from 'express';
import { addSalary,getSalary,getAllSalaries,getAllSaly } from "../controller/SalaryController.js";
;

const router = express.Router();
router.get("/get-all", getAllSaly);
router.post('/add', addSalary);
router.get('/:id', getSalary);
router.get('/getAllSalarie/:id',getAllSalaries) // get all salary particlar  persion 

export default router;
