import { Router } from 'express'
import { AuthRouter } from './router/AuthRouter'
import { GitRouter } from './router/GitRouter'
import { RepoRouter } from './router/RepoRouter'
import { applyRouter } from './utils/decorator'

const router = Router()

applyRouter(router, [AuthRouter, GitRouter, RepoRouter])

export default router
