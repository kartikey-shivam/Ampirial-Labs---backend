import { Schema, model } from 'mongoose'
import { IUser, UserRole } from '../interfaces/user'
import bcrypt from 'bcrypt'

const userSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: String,
    emailVerified: { type: Boolean, default: false },
    role: { type: String, enum: UserRole, default:'CANDIDATE' },
  },

  { timestamps: true }
)
userSchema.pre<IUser>('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    return next()
  } catch (error: any) {
    return next(error)
  }
})
const User = model<IUser>('User', userSchema)
export default User
