import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/RepoDto'

export interface RepoService {
    createRepo(userId: number, dto: CreateRepoReqDto): Promise<CreateRepoResDto>
}
