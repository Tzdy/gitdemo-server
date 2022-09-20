import {
    InfoResDto,
    LoginResDto,
    RegisterResDto,
    SetInfoReqDto,
    SetInfoResDto,
} from '@/dto/auth.dto'

export interface AuthService {
    login(username: string, password: string): Promise<LoginResDto>

    info(id: number): Promise<InfoResDto>

    register(username: string, password: string): Promise<RegisterResDto>

    setInfo(userId: number, info: SetInfoReqDto): Promise<SetInfoResDto>
}
