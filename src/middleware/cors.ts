import { Request, Response, NextFunction } from 'express'
export function CorsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    if (req.headers.origin) {
        res.setHeader('Vary', 'Origin')
    }
    next()
}
