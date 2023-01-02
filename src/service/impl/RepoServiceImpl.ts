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
import { FindOptionsOrder, FindOptionsWhere, In, Like, Not } from 'typeorm'
import { createGitUtil } from '@/utils/git'
import {
    ListRepoFileReqDto,
    ListRepoFileResDto,
} from '@/dto/repo/listRepoFileDto'
import { Item } from '@/entity/Item'
import { Commit } from '@tsdy/git-util/src/git.interface'
import { parseLanguageId } from '@tsdy/git-util'
import {
    ListAllRepoLanguageReqDto,
    ListAllRepoLanguageResDto,
} from '@/dto/repo/listAllRepoLanguageDto'
import { SetRepoReqDto, SetRepoResDto } from '@/dto/repo/setRepoDto'
import { assign } from '@/utils/assign'
import { CatRepoFileReqDto, CatRepoFileResDto } from '@/dto/repo/catRepoFileDto'
import { HttpException } from '@tsdy/express-plugin-exception'

export class RepoServiceImpl implements RepoService {
    // 获取的是username对应的user
    private async findUser(username: string, myselfId?: number) {
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
                about: dto.about,
                language_analysis: [],
            })
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new HttpOKException(
                    20001,
                    `repo name ${dto.repoName} is exist.`
                )
            } else {
                throw new HttpException(500, err.message)
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
        dto: ListRepoReqDto,
        userId?: number
    ): Promise<ListRepoResDto> {
        const where: FindOptionsWhere<Repo> = {}
        const order: FindOptionsOrder<Repo> = {}
        const { isMyself, user } = await this.findUser(dto.username, userId)
        assign(where, 'user_id', user.id)
        if (isMyself) {
            assign(where, 'type', dto.repoType)
        } else {
            where.type = RepoType.PUBLIC
        }
        assign(where, 'language_id', dto.languageId)
        assign(where, 'repo_name', dto.keyword && Like(`${dto.keyword}%`))
        assign(where, 'is_overview', dto.isOverview && Not(0))
        switch (dto.sort) {
            case ListRepoSortType.LAST_UPDATE:
                order.update_time = 'DESC'
                break
            case ListRepoSortType.NAME:
                order.repo_name = 'ASC'
                break
            case ListRepoSortType.STAR:
                order.star_num = 'DESC'
                break
        }
        const list = await model.manager.find(Repo, {
            select: [
                'about',
                'create_time',
                'id',
                'is_overview',
                'language_id',
                'repo_name',
                'star_num',
                'type',
                'update_time',
            ],
            where,
            order,
            skip: (dto.page - 1) * dto.pageSize,
            take: dto.pageSize,
        })
        const resDto = new ListRepoResDto()
        resDto.data = {
            repoList: list.map((item) => {
                const { language_id, create_time, update_time, ...it } = item
                let language = ''
                if (Number.isInteger(language_id)) {
                    // 主语言id为-1的，不展示内容。
                    language = parseLanguageId(language_id)
                        ? parseLanguageId(language_id).name
                        : ''
                }
                return {
                    language,
                    create_time: create_time.getTime(),
                    update_time: update_time.getTime(),
                    ...it,
                }
            }),
        }
        return resDto
    }

    async listRepoFile(dto: ListRepoFileReqDto, userId?: number) {
        const { isMyself, user } = await this.findUser(dto.username, userId)
        const repoWhere: FindOptionsWhere<Repo> = {}
        repoWhere.user_id = user.id
        repoWhere.repo_name = dto.repoName
        // 目标用户的仓库信息
        const repo = await model.manager.findOne(Repo, {
            where: repoWhere,
        })
        if (!repo) {
            throw new HttpOKException(20001, '仓库不存在')
        }
        if (!isMyself) {
            if (repo.type === RepoType.PRIVATE) {
                throw new HttpOKException(20002, '没有权限查看该仓库')
            }
        }
        const gitUtil = createGitUtil(dto.username, dto.repoName)
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

    public async listAllRepoLanguage(
        dto: ListAllRepoLanguageReqDto,
        userId?: number
    ): Promise<ListAllRepoLanguageResDto> {
        const where: FindOptionsWhere<Repo> = {}
        const { isMyself, user } = await this.findUser(dto.username, userId)
        where.user_id = user.id
        if (!isMyself) {
            where.type = RepoType.PUBLIC
        }
        const list = await model.manager
            .getRepository(Repo)
            .createQueryBuilder()
            .select(['language_id'])
            .distinctOn(['language_id'])
            .where(where)
            .getMany()
        const resData = new ListAllRepoLanguageResDto()
        resData.data = {
            languageList: list
                .map((item) => ({
                    name: parseLanguageId(item.language_id)
                        ? parseLanguageId(item.language_id).name
                        : '',
                    id: item.language_id,
                }))
                .filter((item) => item.name),
        }
        return resData
    }

    async setRepo(userId: number, dto: SetRepoReqDto): Promise<SetRepoResDto> {
        const updateVal: Partial<Repo> = {}
        assign(updateVal, 'about', dto.about)
        assign(updateVal, 'repo_name', dto.repoName)
        assign(updateVal, 'language_id', dto.languageId)
        assign(updateVal, 'type', dto.type)
        assign(updateVal, 'website', dto.website)
        assign(updateVal, 'is_overview', dto.isOverview)
        await model.manager.update(
            Repo,
            {
                id: dto.repoId,
                user_id: userId,
            },
            updateVal
        )
        const resData = new SetRepoResDto()
        return resData
    }

    async catRepoFile(
        dto: CatRepoFileReqDto,
        userId?: number
    ): Promise<CatRepoFileResDto> {
        const { isMyself, user } = await this.findUser(dto.username, userId)
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
        const gitUtil = createGitUtil(dto.username, dto.repoName)
        const { size, value } = await gitUtil.findBlob(dto.branch, dto.path)
        const resData = new CatRepoFileResDto()
        resData.data = {
            size,
            value,
        }

        return resData
    }
}
