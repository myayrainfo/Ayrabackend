import express from 'express'
import { verifyAuth, verifySuperAdmin } from '../../../internal/super/middleware/auth.js'
import {
  getSettings,
  updateSettings,
  resetSettings,
} from './settings.controller.js'

const router = express.Router()

// All routes require authentication and superadmin role
router.use(verifyAuth, verifySuperAdmin)

router.get('/', getSettings)
router.put('/', updateSettings)
router.post('/reset', resetSettings)

export default router


