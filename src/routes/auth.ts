import express from 'express'
import AuthController from '../controllers/auth'
import { vLogin, vRegister } from '../validators/auth'
import validateRequest from '../middlewares/validator'

const router = express.Router()

router.post('/login', validateRequest(vLogin), AuthController.login)
router.post('/register', validateRequest(vRegister), AuthController.register)

export default router
