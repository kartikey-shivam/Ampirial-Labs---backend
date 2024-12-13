import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import env from '../configs/env'
import User from '../models/User'
import bcrypt from 'bcrypt'
class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.error('auth.accountNotFound', {}, 404)
      if (!user.password) return res.error('auth.oAuthError')
      const verifyPassword = await bcrypt.compare(password, user.password)
      if (!verifyPassword) throw { status: 401, message: 'Incorrect Password' }
      //@ts-ignore
      user.password = undefined
      console.log(user)
      const payload = {
        _id: user._id,
        email: user.email,
      }
      const token = jwt.sign(payload, env.TOKEN_SECRET, { expiresIn: '30d' })
      return res.success('auth.loggedIn', { user, token })
    } catch (error) {
      next(error)
    }
  }

  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.body)
      let { firstName, lastName, email, password, role } = req.body
      const findUser = await User.findOne({ email })
      if (findUser) return res.error('auth.userAlreadyRegistered')
      const user = await User.create({ firstName, lastName, email, password, role })
      //@ts-ignore
      user.password = undefined
      return res.success('auth.registrationComplete', {}, 201)
    } catch (error) {
      next(error)
    }
  }
}
export default AuthController
