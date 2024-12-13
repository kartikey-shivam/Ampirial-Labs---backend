import { NextFunction, Request, Response } from 'express'
import Offer from '../models/offers'
import User from '../models/User'
import { generateRandomPassword } from '../utils/common'
import { sendEMail } from '../services/Email'
import { OfferStatus } from '../interfaces/offer'
import { UserRole } from '../interfaces/user'
class UserController {
  public static async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, position, salary, email, firstName, lastName } = req.body
      if (!name || !position || !email || !salary) return res.error('offer.fieldRequired')
      let user = await User.findOne({ email })
      if (!user) {
        if (!firstName && !lastName) return res.error('offer.fieldRequired')
        let password = generateRandomPassword()
        await sendEMail(email, 'account', 'Assignment: Account created', { email, password, firstName, lastName })
        user = await User.create({ email, firstName, lastName, password, role: 'CANDIDATE' })
      }
      const offer = await Offer.create({ name, position, salary, recruiter: req.user._id, candidate: user._id, status: 'SUBMITTED' })
      await sendEMail(email, 'offer', 'Assignment: New Offer', {
        name,
        position,
        salary,
      })
      res.success('offer.store', { offer })
    } catch (error) {
      next(error)
    }
  }
  public static async acceptOfferLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = await Offer.findById(req.params.id)
      if (!offer) return res.error('offer.notFound')
      if (offer.status !== OfferStatus.Submitted) res.error('offer.canNotAccept')
      offer.status = OfferStatus.Accepted
      await offer.save()
      return res.success('offer.accepted', { offer })
    } catch (error) {
      next(error)
    }
  }
  public static async rejectOfferLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = await Offer.findById(req.params.id)
      if (!offer) return res.error('offer.notFound')
      if (offer.status !== OfferStatus.Submitted) res.error('offer.canNotAccept')
      offer.status = OfferStatus.Rejected
      await offer.save()
      return res.success('offer.rejected', { offer })
    } catch (error) {
      next(error)
    }
  }
  public static async eSignOfferLetter(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = await Offer.findById(req.params.id)
      console.log(offer,'58')
      if (!offer) return res.error('offer.notFound')
      if (offer.status != OfferStatus.Accepted) return res.error('offer.canNotSign')
      if (req.user.role === UserRole.Candidate) offer.eSignByCandidate = true
      else offer.eSignByRecruiter = true
      await offer.save()
      return res.success('offer.signed', { offer })
    } catch (error) {
      next(error)
    }
  }
  public static async index(req: Request, res: Response, next: NextFunction) {
    try {
      const offers = await Offer.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'candidate',
            foreignField: '_id',
            as: 'candidate',
          },
        },
        {
          $unwind: {
            path: '$candidate',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'recruiter',
            foreignField: '_id',
            as: 'recruiter',
          },
        },
        {
          $unwind: {
            path: '$recruiter',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            position: 1,
            salary: 1,
            status: 1,
            eSignByRecruiter: 1,
            eSignByCandidate: 1,
            recruiter: {
              firstName: '$recruiter.firstName',
              lastName: '$recruiter.lastName',
              email: '$recruiter.email',
            },
            candidate: {
              firstName: '$candidate.firstName',
              lastName: '$candidate.lastName',
              email: '$candidate.email',
            },
          },
        },
      ])
      return res.success('offer.index', { offers })
    } catch (error) {
      next(error)
    }
  }
  public static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const offer = await Offer.findById(id)
      if (!id) return res.error('offer.notFound')
      return res.success('offer.fetched', { offer })
    } catch (error) {
      next(error)
    }
  }

  public static async filterByCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const  candidateId  = req.params.id;
      console.log(candidateId)
      if (!candidateId) return res.error('candidate.fieldRequired');

      const offers = await Offer.aggregate([
        {
          $match: { candidate: candidateId },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'candidate',
            foreignField: '_id',
            as: 'candidate',
          },
        },
        {
          $unwind: {
            path: '$candidate',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'recruiter',
            foreignField: '_id',
            as: 'recruiter',
          },
        },
        {
          $unwind: {
            path: '$recruiter',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            position: 1,
            salary: 1,
            status: 1,
            eSignByRecruiter: 1,
            eSignByCandidate: 1,
            recruiter: {
              firstName: '$recruiter.firstName',
              lastName: '$recruiter.lastName',
              email: '$recruiter.email',
            },
            candidate: {
              firstName: '$candidate.firstName',
              lastName: '$candidate.lastName',
              email: '$candidate.email',
            },
          },
        },
      ]);

      return res.success('offer.filteredByCandidate', { offers });
    } catch (error) {
      next(error);
    }
  }

  
  public static async filterByRecruiter(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: recruiterId } = req.params;
      if (!recruiterId) return res.error('recruiter.fieldRequired');

      const offers = await Offer.aggregate([
        {
          $match: { recruiter: recruiterId },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'candidate',
            foreignField: '_id',
            as: 'candidate',
          },
        },
        {
          $unwind: {
            path: '$candidate',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'recruiter',
            foreignField: '_id',
            as: 'recruiter',
          },
        },
        {
          $unwind: {
            path: '$recruiter',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            position: 1,
            salary: 1,
            status: 1,
            eSignByRecruiter: 1,
            eSignByCandidate: 1,
            recruiter: {
              firstName: '$recruiter.firstName',
              lastName: '$recruiter.lastName',
              email: '$recruiter.email',
            },
            candidate: {
              firstName: '$candidate.firstName',
              lastName: '$candidate.lastName',
              email: '$candidate.email',
            },
          },
        },
      ]);

      return res.success('offer.filteredByRecruiter', { offers });
    } catch (error) {
      next(error);
    }
  }
}
export default UserController
