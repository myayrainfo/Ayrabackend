import express from 'express'
import { login, verifyToken, logout } from './auth.controller.js'
import { verifyAuth } from '../../../internal/super/middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', verifyAuth, logout)
router.get('/verify', verifyAuth, verifyToken)

export default router


