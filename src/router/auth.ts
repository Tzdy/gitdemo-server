import { InfoResDto } from '@/dto/auth/info'
import { RegisterReqDto, RegisterResDto } from '@/dto/auth/register'
import { TokenMiddleWare } from '@/middleware/token'
import { AuthService } from '@/service/auth'
import { asyncException } from '@tsdy/express-plugin-exception'
import { ExpressSwagger } from '@tsdy/express-plugin-swagger'
import { validatorMiddleWare } from '@tsdy/express-plugin-validator'
import { Router } from 'express'
import { LoginReqDto, LoginResDto } from '../dto/auth/login'

export const authRouter = Router()
authRouter.post(
    '/login',
    ExpressSwagger({
        tags: ['auth'],
        parameter: {
            in: 'body',
            dto: RegisterReqDto,
        },
        responses: {
            200: {
                dto: LoginResDto,
            },
        },
    }),

    validatorMiddleWare(LoginReqDto, 'body'),
    asyncException(async (req, res) => {
        const { username, password } = req.body
        const resData = await AuthService.login(username, password)
        res.send(resData)
    })
)

authRouter.post(
    '/register',
    ExpressSwagger({
        tags: ['auth'],
        parameter: {
            in: 'body',
            dto: RegisterReqDto,
        },
        responses: {
            200: {
                dto: RegisterResDto,
            },
        },
    }),
    asyncException(async (req, res) => {
        const { username, password } = req.body
        const resData = await AuthService.register(username, password)
        res.send(resData)
    })
)

authRouter.get(
    '/info',
    ExpressSwagger({
        tags: ['auth'],
        responses: {
            200: {
                dto: InfoResDto,
            },
        },
        security: [
            {
                token: [],
            },
        ],
    }),
    TokenMiddleWare,
    asyncException(async (req, res) => {
        const userId = req.user?._id
        const resData = await AuthService.info(userId)
        res.send(resData)
    })
)
