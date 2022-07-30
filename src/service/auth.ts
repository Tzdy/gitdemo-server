import { UserDao } from '@/dao/user'
import { InfoResDto } from '@/dto/auth/info'
import { LoginResDto } from '@/dto/auth/login'
import { RegisterResDto } from '@/dto/auth/register'
import { sign } from '@/lib/jwt'
import { User } from '@/model/user'
import { HttpOKException } from '@/utils/exception'
import { HttpException } from '@tsdy/express-plugin-exception'
import { Types } from 'mongoose'

export const AuthService = {
    async login(username: string, password: string) {
        const user = await UserDao.findOneByUsername(username)
        if (!user) {
            throw new HttpOKException(20001, 'username is not exist.')
        }
        if (user.password !== password) {
            throw new HttpOKException(20002, 'password is not correct.')
        }
        const token = sign({
            _id: user._id,
        })

        const loginResDto = new LoginResDto()
        loginResDto.data = {
            token,
        }
        return loginResDto
    },

    async register(username: string, password: string) {
        const user = new User()
        user._id = new Types.ObjectId().toHexString()
        user.nickname = `${username}`
        user.username = username
        user.password = password
        try {
            await UserDao.createOne(user)
            const registerResDto = new RegisterResDto()
            return registerResDto
        } catch (err: any) {
            if (err.code === 11000) {
                throw new HttpOKException(20001, 'username is duplicate.')
            } else {
                throw new HttpException(500, err.message)
            }
        }
    },

    async info(userId?: string) {
        if (!userId) {
            throw new HttpException(401, 'not auth.')
        }
        const user = await UserDao.findOneById(userId)
        if (!user) {
            throw new HttpOKException(20001, 'user is not exist.')
        }
        const infoResDto = new InfoResDto()
        infoResDto.data = {
            nickname: user.nickname,
            username: user.username,
        }
        return infoResDto
    },
}
