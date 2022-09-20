import { Router } from 'express'
import { AuthRouter } from './router/AuthRouter'
import { GitRouter } from './router/GitRouter'
import { applyRouter } from './utils/decorator'

const router = Router()

applyRouter(router, [AuthRouter, GitRouter])

export default router
