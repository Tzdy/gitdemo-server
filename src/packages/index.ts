import { Router } from 'express'
import HelloWorld from './helloworld'

const router = Router()
router.use('/helloworld', HelloWorld)

export default router
