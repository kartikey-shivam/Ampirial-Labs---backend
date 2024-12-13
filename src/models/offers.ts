import { Schema, model } from 'mongoose'
import { IOffer, OfferStatus } from '../interfaces/offer'

const offerSchema = new Schema<IOffer>(
  {
    name: { type: String, required: true },
    recruiter: { type: Schema.Types.ObjectId, required: true },
    candidate: { type: Schema.Types.ObjectId, required: true },
    position: { type: String, required: true },
    salary: { type: String, required: true },
    status: { type: String, enum: Object.values(OfferStatus), required: true },
    eSignByRecruiter: { type: Boolean, required: true, default: false },
    eSignByCandidate: { type: Boolean, required: true, default: false },
  },

  { timestamps: true }
)

const Offer = model<IOffer>('Offer', offerSchema)
export default Offer
