import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/repo/createRepoDto'
import {
    ListRepoReqDto,
    ListRepoResDto,
    ListRepoSortType,
} from '@/dto/repo/listRepoDto'
import { Repo } from '@/entity/Repo'
import { User } from '@/entity/User'
import { model } from '@/model'
import { HttpAuthException, HttpOKException } from '@/utils/exception'
import { Git } from '@tsdy/git-util'
import { join } from 'path'
import { RepoService } from '@/service/RepoService'
import { Brackets, FindOptionsOrder, FindOptionsWhere, Like } from 'typeorm'

export class RepoServiceImpl implements RepoService {
    async createRepo(
        userId: number,
        dto: CreateRepoReqDto
    ): Promise<CreateRepoResDto> {
        const createRepoResDto = new CreateRepoResDto()
        try {
            await model.manager.insert(Repo, {
                repo_name: dto.repoName,
                type: dto.type,
                user_id: userId,
                language_analysis: [],
            })
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new HttpOKException(
                    20001,
                    `repo name ${dto.repoName} is exist.`
                )
            }
        }
        const user = await model.manager.findOne(User, {
            where: {
                id: userId,
            },
        })
        if (!user) {
            throw new HttpAuthException(10000, `user is not exist.`)
        }
        const gitUtil = new Git(
            join(process.env.GIT_ROOT_PATH, user.username),
            dto.repoName
        )
        await gitUtil.createDirAndInitBare()
        await model.manager.update(
            User,
            {
                id: user.id,
            },
            {
                repo_total_num: user.repo_total_num + 1,
            }
        )
        createRepoResDto.message = '创建成功'
        return createRepoResDto
    }

    async listRepo(
        userId: number,
        dto: ListRepoReqDto
    ): Promise<ListRepoResDto> {
        const where: FindOptionsWhere<Repo> = {}
        dto.repoType ? (where.type = dto.repoType) : null
        dto.language ? (where.language = dto.language) : null
        dto.keyword ? (where.repo_name = Like(`${dto.keyword}%`)) : null
        const order: FindOptionsOrder<Repo> = {}
        switch (dto.sort) {
            case ListRepoSortType.LAST_UPDATE:
                order.update_time = 'DESC'
                break
            case ListRepoSortType.NAME:
                order.repo_name = 'ASC'
                break
            case ListRepoSortType.STAR:
                order.stars_num = 'DESC'
                break
        }
        const list = await model.manager.find(Repo, {
            where,
            order,
            skip: (dto.page - 1) * dto.pageSize,
            take: dto.pageSize,
        })

        const resDto = new ListRepoResDto()
        resDto.data = {
            repoList: list,
        }
        return resDto
    }
}
