import { InfoReqDto, InfoResDto, OtherInfoReqDto } from '@/dto/auth/getInfoDto'
import { LoginResDto } from '@/dto/auth/loginDto'
import { RegisterResDto } from '@/dto/auth/registryDto'
import { SetInfoReqDto, SetInfoResDto } from '@/dto/auth/setInfoDto'
import { UploadAvatarResDto } from '@/dto/auth/uploadAvatarDto'
import { User } from '@/entity/User'

export interface AuthService {
    login(username: string, password: string): Promise<LoginResDto>

    info(id: number): Promise<InfoResDto>

    otherInfo(dto: OtherInfoReqDto): Promise<InfoResDto>

    register(username: string, password: string): Promise<RegisterResDto>

    setInfo(userId: number, info: SetInfoReqDto): Promise<SetInfoResDto>

    uploadAvatar(userId: number): Promise<UploadAvatarResDto>
}
