import express from 'express';
import {
  createPunchIn,
  punchOut,
  getAllPunches,
  getPunchesByEmployee,
  getMonthlyHours ,
  getSummaryByEmployee,
  approveAttendance ,

} from '../controller/PunchController.js';

const router = express.Router();
router.post('/punch-in', createPunchIn);
router.post('/punch-out', punchOut);
router.get('/punch', getAllPunches);
router.get('/punch/date/time', getMonthlyHours);
router.get('/punch/:id', getPunchesByEmployee); // get punch by id  particular 
router.get('/punch/getalldetailbyemp/:id',getSummaryByEmployee)
router.post('/approve/:id', approveAttendance);

export default router;
