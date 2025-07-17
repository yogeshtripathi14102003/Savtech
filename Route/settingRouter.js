import express from 'express'
import {changePassword} from '../controller/SettingController.js'

const  router = express.Router()

router.put('/change-password',changePassword )
//router.post('/change-password',changePassword )
export default router;