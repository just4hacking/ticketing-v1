import express from 'express'
import { currentUser } from '@asatickets/common'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
  console.log('CURRENT USER REQUEST')
  res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }