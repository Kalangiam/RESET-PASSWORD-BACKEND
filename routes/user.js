import express from "express"
import UserController from '../controllers/users.js'


const router = express.Router()

router.post('/forgot-password',UserController.forgotPassword )
router.post('/reset-password',UserController.resetPassword)


export default router