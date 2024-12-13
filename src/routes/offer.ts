import express from 'express'
import OfferController from '../controllers/offer'
import { isAuthenticated, validateRole } from '../middlewares/auth'

const router = express.Router()

router.post('/create', isAuthenticated, validateRole('RECRUITER'), OfferController.store)
router.post('/accept/:id', isAuthenticated, validateRole('CANDIDATE'), OfferController.acceptOfferLetter)
router.post('/reject/:id', isAuthenticated, validateRole('CANDIDATE'), OfferController.rejectOfferLetter)
router.post('/e-sign/:id', isAuthenticated, OfferController.eSignOfferLetter)
router.get('/', isAuthenticated, OfferController.index)
router.get('/:id', isAuthenticated, OfferController.show)
export default router
