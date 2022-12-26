import { Router } from 'express'
import { AuthRouter } from './router/AuthRouter'
import { GitRouter } from './router/GitRouter'
import { PublicRouter } from './router/PublicRouter'
import { RepoRouter } from './router/RepoRouter'
import { applyRouter } from './utils/decorator'

export const router = Router()
export const gitRouter = Router()
applyRouter(router, [AuthRouter, RepoRouter, PublicRouter])

applyRouter(gitRouter, [GitRouter])
