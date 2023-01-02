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
import { UploadAvatarResDto } from '@/dto/auth/uploadAvatarDto'

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
                'avatar_version',
                'bio',
                'org',
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
        const { created_time, ...userData } = user
        infoResDto.data = {
            info: {
                created_time: created_time.getTime(),
                ...userData,
            },
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
                'avatar_version',
                'bio',
                'org',
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
        const { created_time, ...userData } = user
        infoResDto.data = {
            info: {
                created_time: created_time.getTime(),
                ...userData,
            },
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
        assign(updateVal, 'nickname', info.nickname)
        assign(updateVal, 'org', info.org)
        assign(updateVal, 'address', info.address)
        assign(updateVal, 'bio', info.bio)
        assign(updateVal, 'link', info.link)
        assign(updateVal, 'twitter', info.twitter)
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

    public async uploadAvatar(userId: number): Promise<UploadAvatarResDto> {
        const user = await model.manager.findOne(User, {
            where: {
                id: userId,
            },
            select: ['avatar_version'],
        })
        if (!user) {
            throw new HttpAuthException(10000, '用户不存在')
        }
        let version = user.avatar_version + 1
        if (version > 10) {
            version = 1
        }
        await model.manager.update(
            User,
            { id: userId },
            {
                avatar_version: version,
            }
        )
        const resDto = new UploadAvatarResDto()
        resDto.data = {
            v: version,
        }
        return resDto
    }

    private async createUserRootDir(username: string) {
        await mkdir(join(process.env.GIT_ROOT_PATH, username))
    }
}
