import express from 'express'
import UserRoutes from './user.js'
import IndexController from '../controllers/index.js'




const router = express.Router()

router.get('/', IndexController.home)
router.use('/users', UserRoutes)

export default router