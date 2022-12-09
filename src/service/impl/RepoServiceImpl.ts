import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/repo/createRepoDto'
import {
    ListRepoReqDto,
    ListRepoResDto,
    ListRepoSortType,
} from '@/dto/repo/listRepoDto'
import { Repo, RepoType } from '@/entity/Repo'
import { User } from '@/entity/User'
import { model } from '@/model'
import { HttpAuthException, HttpOKException } from '@/utils/exception'
import { RepoService } from '@/service/RepoService'
import { FindOptionsOrder, FindOptionsWhere, In, Like } from 'typeorm'
import { createGitUtil } from '@/utils/git'
import {
    ListRepoFileReqDto,
    ListRepoFileResDto,
} from '@/dto/repo/listRepoFileDto'
import { Item } from '@/entity/Item'
import { Commit } from '@tsdy/git-util/src/git.interface'

export class RepoServiceImpl implements RepoService {
    private async findUser(myselfId: number, username: string) {
        const user = await model.manager.findOne(User, {
            where: {
                username,
            },
        })
        if (!user) {
            throw new HttpOKException(20001, '用户不存在')
        }
        return {
            isMyself: myselfId === user.id,
            user,
        }
    }

    public async createRepo(
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
        const gitUtil = createGitUtil(user.username, dto.repoName)
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
        const { isMyself } = await this.findUser(userId, dto.username)
        const where: FindOptionsWhere<Repo> = {}
        // 如果不是自己，不能看私有仓库
        if (!isMyself) {
            where.type = RepoType.PUBLIC
        }
        console.log(dto)
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

    async listRepoFile(userId: number, dto: ListRepoFileReqDto) {
        const { isMyself, user } = await this.findUser(userId, dto.username)
        const gitUtil = createGitUtil(dto.username, dto.repoName)
        // 目标用户的仓库信息
        const repo = await model.manager.findOne(Repo, {
            where: {
                user_id: user.id,
                repo_name: dto.repoName,
            },
        })
        if (!repo) {
            throw new HttpOKException(20001, '仓库不存在')
        }
        if (!isMyself) {
            if (repo.type === RepoType.PRIVATE) {
                throw new HttpOKException(20002, '没有权限查看该仓库')
            }
        }
        const itemList = await gitUtil.findTree(dto.branch, dto.path)
        const itemCommitList = await model.manager.find(Item, {
            where: {
                user_id: user.id,
                repo_id: repo.id,
                hash: In(itemList.map((item) => item.hash)),
            },
        })
        const commitList = await gitUtil.findCommit(
            dto.branch,
            undefined,
            undefined,
            itemCommitList.map((item) => item.commit_hash)
        )
        const resDto = new ListRepoFileResDto()
        resDto.data = {
            list: itemList.map((item) => {
                const itemCommit = itemCommitList.find(
                    (i) => i.hash === item.hash
                ) as Item
                const commit = commitList.find(
                    (i) => i.commitHash === itemCommit.commit_hash
                ) as Commit
                return {
                    ...commit,
                    ...item,
                }
            }),
        }
        return resDto
    }
}
