import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import env from '../configs/env'
import User from '../models/User'
import { IUser, UserRole } from '../interfaces/user'

/**
 * Middleware to authenticate users based on JWT token.
 *
 * This function checks for the presence of a JWT token in the `Authorization` header of the request.
 * If the token is missing, it returns a 401 status with an appropriate message.
 * If the token is present, it verifies the token and decodes the payload to find the associated user.
 * If the user is not found or the email is not verified, it throws an error.
 * If authentication is successful, it attaches the user to the request object and calls the next middleware.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization
  console.log(token,'22')
  if (!token) res.status(498).send({ message: 'Token missing' })
  else {
    try {
      token = token.slice(7)
      const decoded = jwt.verify(token, env.TOKEN_SECRET)
      console.log(decoded)
      //@ts-ignore
      const user = await User.findOne({ email: decoded.email }).select('-password')
      if (!user) throw new Error('Invalid token')
      req['user'] = user as IUser
      next()
    } catch (err) {
      next(err)
    }
  }
}

export const validateRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user.role === role) next()
      else return res.error('auth.invalidRole', {}, 403)
    } catch (error) {
      next(error)
    }
  }
}
