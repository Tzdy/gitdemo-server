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

export interface RepoService {
    createRepo(userId: number, dto: CreateRepoReqDto): Promise<CreateRepoResDto>

    setRepo(userId: number, dto: SetRepoReqDto): Promise<SetRepoResDto>

    listRepo(userId: number, dto: ListRepoReqDto): Promise<ListRepoResDto>

    // 获取该用户所有仓库的语言列表
    listAllRepoLanguage(
        userId: number,
        dto: ListAllRepoLanguageReqDto
    ): Promise<ListAllRepoLanguageResDto>

    // 获取带commit信息的tree列表
    listRepoFile(
        userId: number,
        dto: ListRepoFileReqDto
    ): Promise<ListRepoFileResDto>

    catRepoFile(
        userId: number,
        dto: CatRepoFileReqDto
    ): Promise<CatRepoFileResDto>
}
