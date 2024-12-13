import { Document, ObjectId } from 'mongoose'

export interface IOffer extends Document {
  name: string
  candidate: ObjectId
  recruiter: ObjectId
  position: string
  salary: string
  status: OfferStatus
  eSignByRecruiter: Boolean
  eSignByCandidate: Boolean
}

export type OfferStatus = 'ACCEPTED' | 'PENDING' | 'SUBMITTED' | 'REJECTED' | 'REVOKED'

export const OfferStatus = {
  Accepted: 'ACCEPTED',
  Pending: 'PENDING',
  Submitted: 'SUBMITTED',
  Rejected: 'REJECTED',
  Revoked: 'REVOKED',
} as const
