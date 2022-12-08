import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/repo/createRepoDto'
import { ListRepoReqDto, ListRepoResDto } from '@/dto/repo/listRepoDto'
import {
    ListRepoLanguageReqDto,
    ListRepoLanguageResDto,
} from '@/dto/repo/listRepoLanguageDto'
import { Item } from '@/entity/Item'

interface TreeCommitItem extends Item {
    commitHash: string
    committerName: string
    commitTime: Date
    commitBody: string
}

export interface RepoService {
    createRepo(userId: number, dto: CreateRepoReqDto): Promise<CreateRepoResDto>

    listRepo(userId: number, dto: ListRepoReqDto): Promise<ListRepoResDto>

    // 获取该用户所有仓库的语言列表
    listRepoLanguage(
        userId: number,
        dto: ListRepoLanguageReqDto
    ): Promise<ListRepoLanguageResDto>

    // 获取带commit信息的tree列表
    listRepoFile(
        userId: number,
        repoName: string,
        path: string
    ): Promise<TreeCommitItem[]>
}
