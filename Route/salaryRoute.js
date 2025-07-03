import express from 'express';
import { addSalary,getSalary,getoverSalaries,getAllSalaries } from "../controller/SalaryController.js";


const router = express.Router();

router.post('/add', addSalary);

router.get('/:id', getSalary);
router.get('/getAllSalarie/:id',getAllSalaries) // get all salary particlar  persion 
router.get('/getoverSalaries', getoverSalaries) // this is all salary table 
export default router;
