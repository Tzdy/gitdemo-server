import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/repo/createRepoDto'
import { ListRepoReqDto, ListRepoResDto } from '@/dto/repo/listRepoDto'
import {
    ListRepoLanguageReqDto,
    ListRepoLanguageResDto,
} from '@/dto/repo/listRepoLanguageDto'

export interface RepoService {
    createRepo(userId: number, dto: CreateRepoReqDto): Promise<CreateRepoResDto>

    listRepo(userId: number, dto: ListRepoReqDto): Promise<ListRepoResDto>

    // 获取该用户所有仓库的语言列表
    listRepoLanguage(
        userId: number,
        dto: ListRepoLanguageReqDto
    ): Promise<ListRepoLanguageResDto>
}