// dotenv 不会覆盖原有值。
import dotenv from 'dotenv'
import { logicError } from '@tsdy/express-plugin-exception'
import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import { CorsMiddleware } from './middleware/cors'
import { router } from './router'
import { swagger } from './swagger'
import { mongodbInit } from './model'
import { resolve } from 'path'

dotenv.config({ path: resolve('.env.local') })
const app = express()
async function bootstrap() {
    await mongodbInit()
    app.use(bodyParser.json())
    app.use('*', CorsMiddleware)
    app.use('/api', router)
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        logicError(err, res)
        next()
    })
    swagger(app)
    app.listen(process.env.PORT, () => {
        console.log(`http://localhost:${process.env.PORT}/api`)
    })
}
bootstrap()
