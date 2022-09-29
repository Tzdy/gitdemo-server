import { InfoResDto, InfoReqDto } from '@/dto/auth/getInfoDto'
import { LoginResDto, LoginReqDto } from '@/dto/auth/loginDto'
import { RegisterResDto, RegisterReqDto } from '@/dto/auth/registryDto'
import { TokenMiddleWare } from '@/middleware/token'
import { AuthServiceImpl } from '@/service/impl/AuthServiceImpl'
import {
    ApiResponse,
    ApiSecurity,
    ApiTag,
    Body,
    Controller,
    Post,
    TokenPlyload,
    UseGuards,
} from '@/utils/decorator'

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
        return await this.authService.info(id)
    }
}
