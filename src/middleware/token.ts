import { Request, Response, NextFunction } from 'express'
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { verify } from '@/utils/jwt'
import { HttpAuthException } from '@/utils/exception'
export function TokenMiddleWare(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization
    req.user = {}
    if (typeof token === 'string') {
        let json = null
        try {
            json = verify(token) as JwtPayload
        } catch (err: any) {
            if (err instanceof TokenExpiredError) {
                return next(new HttpAuthException(100, 'token expires'))
            }
        }
        if (json) {
            const { id } = json.payload
            req.user = {
                id,
            }
            return next()
        }
    }
    next(new HttpAuthException(101, '重新登陆'))
}

// 适用于既可以公共访问也可以私有访问的接口
export function AvailableTokenMiddleWare(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization
    req.user = {}
    if (typeof token === 'string' && token) {
        let json = null
        try {
            json = verify(token) as JwtPayload
        } catch (err: any) {}
        if (json) {
            const { id } = json.payload
            req.user = {
                id,
            }
            return next()
        }
    } else {
        next()
    }
}
