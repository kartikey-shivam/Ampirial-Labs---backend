import { Document } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  emailVerified: boolean
  avatar?: string
  role: UserRole
}

export type UserRole = 'RECRUITER' | 'CANDIDATE'

export const UserRole = {
  Recruiter: 'RECRUITER',
  Candidate: 'CANDIDATE',
}
