import express from 'express'
import { verify,login} from '../controller/AuthController.js'
// import { authMiddleware } from '../middleware/authMiddleware.js'
// import { verify } from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js'
 const router = express.Router();


 router.post('/login', login)
router.get('/verify',authMiddleware,verify)
 export default router;