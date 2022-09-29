import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/repo/createRepoDto'

export interface RepoService {
    createRepo(userId: number, dto: CreateRepoReqDto): Promise<CreateRepoResDto>
}
