import express from 'express';

import { addmastersalary ,getoverSalaries,getoverSalaryById} from "../controller/MasterController.js";


const router = express.Router();


router.post('/Addmaster', addmastersalary) // this is all salary table 
router.get('/getoverSalaries', getoverSalaries)
router.get('/getovrby/:id',getoverSalaryById);

export default router;