import jwt from 'jsonwebtoken'
// jwt token 超时时间单位ms
/**
 * @description
 * Eg: 60, "2 days", "10h", "7d"
 *
 * 详情参考：https://github.com/vercel/ms
 */
export const maxAge = '1d' // 一天

export function sign(payload: any) {
    return jwt.sign(
        {
            payload,
            exp: Date.now(),
        },
        process.env.TOKEN_SECRET
    )
}

export function verify(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET, {
        maxAge,
    })
}
