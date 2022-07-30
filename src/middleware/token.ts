import { Request, Response, NextFunction } from 'express'
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { HttpException } from '@tsdy/express-plugin-exception'
import { verify } from '../lib/jwt'
export function TokenMiddleWare(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization
    if (typeof token === 'string') {
        let json = null
        try {
            json = verify(token) as JwtPayload
        } catch (err: any) {
            if (err instanceof TokenExpiredError) {
                return next(new HttpException(401, 'token expires'))
            }
        }
        if (json) {
            const { _id } = json.payload
            req.user = {
                _id,
            }
            return next()
        }
    }
    next(new HttpException(401, '重新登陆'))
}
