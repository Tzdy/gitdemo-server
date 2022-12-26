import { User } from '@/entity/User'
import { model } from '@/model'
import { sign } from '@/utils/jwt'
import { AuthService } from '@/service/AuthService'
import { HttpAuthException, HttpOKException } from '@/utils/exception'
import { HttpException } from '@tsdy/express-plugin-exception'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { InfoReqDto, InfoResDto, OtherInfoReqDto } from '@/dto/auth/getInfoDto'
import { LoginResDto } from '@/dto/auth/loginDto'
import { RegisterResDto } from '@/dto/auth/registryDto'
import { SetInfoReqDto, SetInfoResDto } from '@/dto/auth/setInfoDto'
import { FindOptionsWhere } from 'typeorm'
import { assign } from '@/utils/assign'

export class AuthServiceImpl implements AuthService {
    public async login(
        username: string,
        password: string
    ): Promise<LoginResDto> {
        const user = await model.manager.findOne(User, {
            where: {
                username,
                password: Buffer.from(password, 'utf-8').toString('base64'),
            },
        })
        if (!user) {
            throw new HttpAuthException(10000, '账号或密码错误')
        }
        const loginResDto = new LoginResDto()
        const token = sign({
            id: user.id,
        })
        loginResDto.data = {
            token,
        }
        return loginResDto
    }

    public async otherInfo(dto: OtherInfoReqDto): Promise<InfoResDto> {
        const infoResDto = new InfoResDto()
        const where: FindOptionsWhere<User> = {}
        assign(where, 'username', dto.username)
        const user = await model.manager.findOne(User, {
            select: [
                'username',
                'id',
                'nickname',
                'address',
                'avatar',
                'bio',
                'created_time',
                'link',
                'twitter',
                'repo_total_num',
                'star_total_num',
            ],
            where,
        })
        if (!user) {
            throw new HttpAuthException(20001, '用户不存在')
        }
        infoResDto.data = {
            info: user,
        }
        return infoResDto
    }

    public async info(id: number): Promise<InfoResDto> {
        const infoResDto = new InfoResDto()
        const where: FindOptionsWhere<User> = {}
        // 有username，就查询username，没有才根据id查
        assign(where, 'id', id)
        const user = await model.manager.findOne(User, {
            select: [
                'username',
                'id',
                'nickname',
                'address',
                'avatar',
                'bio',
                'created_time',
                'link',
                'twitter',
                'repo_total_num',
                'star_total_num',
            ],
            where,
        })
        if (!user) {
            throw new HttpAuthException(20001, '用户不存在')
        }
        infoResDto.data = {
            info: user,
        }
        return infoResDto
    }

    async register(
        username: string,
        password: string
    ): Promise<RegisterResDto> {
        const registerResDto = new RegisterResDto()
        try {
            const userEntity = new User()
            userEntity.username = username
            userEntity.password = Buffer.from(password, 'utf-8').toString(
                'base64'
            )
            userEntity.nickname = username
            await model.manager.save(userEntity)
            await this.createUserRootDir(username)
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new HttpOKException(20001, '用户名重复')
            } else {
                throw new HttpException(500, err.message)
            }
        }
        registerResDto.message = '注册成功'
        return registerResDto
    }

    public async setInfo(
        userId: number,
        info: SetInfoReqDto
    ): Promise<SetInfoResDto> {
        const setInfoResDto = new SetInfoResDto()
        const keys = Object.keys(info)
        if (keys.length === 0) {
            throw new HttpOKException(20001, '请输入需要修改的值')
        }
        const updateVal: Partial<User> = {}
        keys.forEach((key) => {
            if (Reflect.has(info, key)) {
                Reflect.set(updateVal, key, Reflect.get(info, key))
            }
        })
        try {
            await model.manager.update(
                User,
                {
                    id: userId,
                },
                updateVal
            )
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new HttpOKException(20002, '名称nickname已存在')
            } else {
                throw new HttpException(500, err.message)
            }
        }
        setInfoResDto.message = '修改成功'
        return setInfoResDto
    }

    private async createUserRootDir(username: string) {
        await mkdir(join(process.env.GIT_ROOT_PATH, username))
    }
}
