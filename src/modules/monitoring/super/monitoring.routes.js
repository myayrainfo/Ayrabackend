import express from 'express'
import { verifyAuth, verifySuperAdmin } from '../../../internal/super/middleware/auth.js'
import {
  getDashboardStats,
  getAuditLogs,
  getSystemHealth,
  getSystemActivity,
} from './monitoring.controller.js'

const router = express.Router()

// All routes require authentication and superadmin role
router.use(verifyAuth, verifySuperAdmin)

router.get('/dashboard-stats', getDashboardStats)
router.get('/audit-logs', getAuditLogs)
router.get('/system-health', getSystemHealth)
router.get('/system-activity', getSystemActivity)

export default router


