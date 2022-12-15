import { InfoResDto, InfoReqDto } from '@/dto/auth/getInfoDto'
import { LoginResDto, LoginReqDto } from '@/dto/auth/loginDto'
import { RegisterResDto, RegisterReqDto } from '@/dto/auth/registryDto'
import { SetInfoReqDto, SetInfoResDto } from '@/dto/auth/setInfoDto'
import { TokenMiddleWare } from '@/middleware/token'
import { AuthServiceImpl } from '@/service/impl/AuthServiceImpl'
import {
    ApiResponse,
    ApiSecurity,
    ApiTag,
    Body,
    Controller,
    Files,
    Post,
    TokenPlyload,
    Upload,
    UseGuards,
} from '@/utils/decorator'
import { DiskStorageOptions, Multer } from 'multer'
import { resolve } from 'path'

@ApiTag('Auth')
@Controller('auth')
export class AuthRouter {
    constructor(private readonly authService: AuthServiceImpl) {}

    @Post('login')
    @ApiResponse(200, LoginResDto)
    async login(@Body() body: LoginReqDto) {
        return await this.authService.login(body.username, body.password)
    }

    @Post('register')
    @ApiResponse(200, RegisterResDto)
    async register(@Body() body: RegisterReqDto) {
        return await this.authService.register(body.username, body.password)
    }

    @Post('info')
    @UseGuards(TokenMiddleWare)
    @ApiSecurity('token')
    @ApiResponse(200, InfoResDto)
    async info(@Body() body: InfoReqDto, @TokenPlyload('id') id: number) {
        console.log('info')
        return await this.authService.info(id)
    }

    @Post('set_info')
    @UseGuards(TokenMiddleWare)
    @ApiSecurity('token')
    @ApiResponse(200, SetInfoResDto)
    async setInfo(@Body() body: SetInfoReqDto, @TokenPlyload('id') id: number) {
        return await this.authService.setInfo(id, body)
    }

    @Post('upload_info_avatar')
    @Upload({
        storage: {
            destination(req, file, cb) {
                const dir = resolve(process.env.UPLOAD_INFO_AVATAR)
                cb(null, dir)
            },
            filename(req, file, cb) {
                // file.filename 传送方可能没起名字。。。
                cb(null, file.originalname)
            },
        },
        fields: [{ name: 'avatar' }],
    })
    async uploadAvatar(@Files() files: Express.Multer.File[]) {
        return {}
    }
}
