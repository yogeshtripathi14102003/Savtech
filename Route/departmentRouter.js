import express from 'express';
import { DepartmentController,getDepartments, editDepartments,updateDepartment,deleteDepartment} from '../controller/DepartmentController.js';
// import authMiddleware from '../middleware/authMiddleware.js'; // optional if auth needed

const router = express.Router();

router.post('/add', DepartmentController);
router.get('/get', getDepartments);
router.get('/:id', editDepartments);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);
export default router;
