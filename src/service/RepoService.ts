import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/repo/createRepoDto'
import { ListRepoReqDto, ListRepoResDto } from '@/dto/repo/listRepoDto'
import {
    ListRepoFileReqDto,
    ListRepoFileResDto,
    TreeCommitItem,
} from '@/dto/repo/listRepoFileDto'
import {
    ListAllRepoLanguageReqDto,
    ListAllRepoLanguageResDto,
} from '@/dto/repo/listAllRepoLanguageDto'
import { SetRepoReqDto, SetRepoResDto } from '@/dto/repo/setRepoDto'
import { CatRepoFileReqDto, CatRepoFileResDto } from '@/dto/repo/catRepoFileDto'
import { GetOneRepoReqDto, GetOneRepoResDto } from '@/dto/repo/getOneRepoDto'

export interface RepoService {
    createRepo(userId: number, dto: CreateRepoReqDto): Promise<CreateRepoResDto>

    getOneRepo(
        dto: GetOneRepoReqDto,
        userId?: number
    ): Promise<GetOneRepoResDto>

    setRepo(userId: number, dto: SetRepoReqDto): Promise<SetRepoResDto>

    listRepo(dto: ListRepoReqDto, userId?: number): Promise<ListRepoResDto>

    // 获取该用户所有仓库的语言列表
    listAllRepoLanguage(
        dto: ListAllRepoLanguageReqDto,
        userId?: number
    ): Promise<ListAllRepoLanguageResDto>

    // 获取带commit信息的tree列表
    listRepoFile(
        dto: ListRepoFileReqDto,
        userId?: number
    ): Promise<ListRepoFileResDto>

    catRepoFile(
        dto: CatRepoFileReqDto,
        userId?: number
    ): Promise<CatRepoFileResDto>
}
