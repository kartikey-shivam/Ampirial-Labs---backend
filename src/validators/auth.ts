import Joi from 'joi'
import { UserRole } from '../interfaces/user'

export const vRegister = Joi.object({
  firstName: Joi.string().min(3).max(25).required(),
  lastName: Joi.string().min(3).max(25).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
})

export const vResetPassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
})
export const vDeleteAccount = Joi.object({
  password: Joi.string().required(),
})

export const vLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
