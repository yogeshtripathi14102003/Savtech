import express from 'express';
import cros from 'cors';
import connectToDatabse from './models/db.js'
import departmentRouter from './Route/departmentRouter.js'
import authRouter from './Route/auth.js'
import EmplloyeeRouter from './Route/EmployeeRouter.js'
import salaryRoute from './Route/salaryRoute.js'
import leaveRoute from './Route/leaveRoute.js';
import settingRouter from './Route/settingRouter.js'
import PunchRoute from './Route/punchRoute.js';
import MasterRouter from './Route/MasterRouter.js';
import DashbordRouter from './Route/DashbordRoute.js';
connectToDatabse()
const app = express ()
app.use(cros())
app.use(express.json())
app.use(express.static('public/uploads'))
app.use('/v1/auth',authRouter);
app.use('/v1/department',departmentRouter)
app.use('/v1', EmplloyeeRouter)
app.use('/api/salary', salaryRoute)
app.use('/v1/leave',leaveRoute )
app.use('/v1/setting',settingRouter)
app.use('/v1',PunchRoute);
app.use('/v1/dashbord',DashbordRouter);
app.use('/api/v1/master',MasterRouter);






app.listen(process.env.PORT, () =>{
    console.log(`servr is running on port  ${process.env.PORT}`)
})
