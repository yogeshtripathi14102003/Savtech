import express from 'express';
import {
  createPunchIn,
  punchOut,
  getAllPunches,
  getPunchesByEmployee,
  getMonthlyHours ,
  getSummaryByEmployee,

} from '../controller/PunchController.js';

const router = express.Router();
router.post('/punch-in', createPunchIn);
router.post('/punch-out', punchOut);
router.get('/punch', getAllPunches);
router.get('/punch/date/time', getMonthlyHours);
router.get('/punch/:id', getPunchesByEmployee);
router.get('/punch/getalldetailbyemp/:id',getSummaryByEmployee)

export default router;
