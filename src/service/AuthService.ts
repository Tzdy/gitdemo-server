import { InfoResDto } from '@/dto/auth/getInfoDto'
import { LoginResDto } from '@/dto/auth/loginDto'
import { RegisterResDto } from '@/dto/auth/registryDto'
import { SetInfoReqDto, SetInfoResDto } from '@/dto/auth/setInfoDto'
import { User } from '@/entity/User'

export interface AuthService {
    login(username: string, password: string): Promise<LoginResDto>

    info(id: number): Promise<InfoResDto>

    register(username: string, password: string): Promise<RegisterResDto>

    setInfo(userId: number, info: SetInfoReqDto): Promise<SetInfoResDto>

    findUserByUsername(username: string): Promise<User | null>
}
