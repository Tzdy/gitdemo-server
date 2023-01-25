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
import { FindOptionsOrder, FindOptionsWhere, Like, Not } from 'typeorm'
import { createGitUtil } from '@/utils/git'
import {
    ListRepoFileReqDto,
    ListRepoFileResDto,
} from '@/dto/repo/listRepoFileDto'
import {
    ListAllRepoLanguageReqDto,
    ListAllRepoLanguageResDto,
} from '@/dto/repo/listAllRepoLanguageDto'
import { SetRepoReqDto, SetRepoResDto } from '@/dto/repo/setRepoDto'
import { assign } from '@/utils/assign'
import { CatRepoFileReqDto, CatRepoFileResDto } from '@/dto/repo/catRepoFileDto'
import { HttpException } from '@tsdy/express-plugin-exception'
import { TreeItem } from '@tsdy/git-util/src/git.interface'
import { GetOneRepoReqDto, GetOneRepoResDto } from '@/dto/repo/getOneRepoDto'
import { parseLanguage } from '@/utils/language'
import {
    ListRepoRefReqDto,
    ListRepoRefResDto,
    RefType,
} from '@/dto/repo/listRepoRefDto'
import {
    GetOneRepoCommitReqDto,
    GetOneRepoCommitResDto,
} from '@/dto/repo/getOneRepoCommit'

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

    private async getAndCheckRepo(
        isMyself: boolean,
        repoName: string,
        userId: number
    ) {
        // 目标用户的仓库信息
        const repo = await model.manager.findOne(Repo, {
            where: {
                user_id: userId,
                repo_name: repoName,
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
        return repo
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

    async getOneRepo(
        dto: GetOneRepoReqDto,
        userId?: number | undefined
    ): Promise<GetOneRepoResDto> {
        const { user, isMyself } = await this.findUser(dto.username, userId)
        const where: FindOptionsWhere<Repo> = {
            user_id: user.id,
            repo_name: dto.repoName,
        }
        if (!isMyself) {
            assign(where, 'type', RepoType.PUBLIC)
        }
        const repo = await model.manager.findOne(Repo, {
            where,
        })
        if (!repo) {
            throw new HttpOKException(
                20001,
                `仓库${dto.username}/${dto.repoName}不存在`
            )
        }
        const resData = new GetOneRepoResDto()
        resData.data = {
            id: repo.id,
            repoName: repo.repo_name,
            about: repo.about,
            createTime: repo.create_time.getTime(),
            isOverview: repo.is_overview,
            starNum: repo.star_num,
            type: repo.type,
            updateTime: repo.update_time.getTime(),
            website: repo.website,
            language: parseLanguage(repo.language_id),
            languageAnalysis: repo.language_analysis.map((item) => ({
                language: parseLanguage(item.language_id),
                languageId: item.language_id,
                fileNum: item.file_num,
            })),
        }
        return resData
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
            repoList: list.map((repo) => {
                return {
                    id: repo.id,
                    repoName: repo.repo_name,
                    about: repo.about,
                    createTime: repo.create_time.getTime(),
                    isOverview: repo.is_overview,
                    starNum: repo.star_num,
                    type: repo.type,
                    updateTime: repo.update_time.getTime(),
                    language: parseLanguage(repo.language_id),
                }
            }),
        }
        return resDto
    }

    async listRepoRef(
        dto: ListRepoRefReqDto,
        userId?: number | undefined
    ): Promise<ListRepoRefResDto> {
        const { isMyself, user } = await this.findUser(dto.username, userId)
        if (!isMyself) {
            const repo = await model.manager.findOne(Repo, {
                where: {
                    type: RepoType.PUBLIC,
                    repo_name: dto.repoName,
                    user_id: user.id,
                },
            })
            if (!repo) {
                throw new HttpOKException(
                    20001,
                    `仓库${dto.username}/${dto.repoName}不存在`
                )
            }
        }
        const gitUtil = createGitUtil(user.username, dto.repoName)
        const reflist = await gitUtil.showRef(dto.type === RefType.TAG)
        const resData = new ListRepoRefResDto()
        resData.data = {
            list: reflist,
        }
        return resData
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
        let itemList: Required<TreeItem>[] = []
        try {
            itemList = await gitUtil.lsTree(dto.branch, dto.path, true)
        } catch (err: any) {
            if (err.code === 128) {
                throw new HttpOKException(20003, `分支${dto.branch}不存在`)
            }
            throw new HttpException(500, err.message)
        }
        if (itemList.length === 0) {
            throw new HttpOKException(
                20004,
                `分支${dto.branch}的路径${dto.path}不存在`
            )
        }
        const resDto = new ListRepoFileResDto()
        resDto.data = {
            list: itemList,
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
            .distinct(true)
            .select('language_id')
            .where(where)
            .getRawMany<Repo>()
        // 用getMany时distinct不生效。。。
        const resData = new ListAllRepoLanguageResDto()
        resData.data = {
            languageList: list
                .map((item) => ({
                    name: parseLanguage(item.language_id),
                    id: item.language_id,
                }))
                .filter((item) => item.name),
        }
        return resData
    }

    public async setRepo(
        userId: number,
        dto: SetRepoReqDto
    ): Promise<SetRepoResDto> {
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

    public async catRepoFile(
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
        const { size, value } = await gitUtil.catFile(dto.branch, dto.path)
        const resData = new CatRepoFileResDto()
        resData.data = {
            size,
            value,
        }

        return resData
    }

    public async getOneRepoCommit(
        dto: GetOneRepoCommitReqDto,
        userId?: number | undefined
    ): Promise<GetOneRepoCommitResDto> {
        const { isMyself, user } = await this.findUser(dto.username, userId)
        // 目标用户的仓库信息
        await this.getAndCheckRepo(isMyself, dto.repoName, user.id)
        const gitUtil = createGitUtil(dto.username, dto.repoName)
        const commitList = await gitUtil.findCommit(
            dto.branch,
            1,
            1,
            dto.commitHash ? [dto.commitHash] : undefined
        )
        const commit = commitList[0]
        if (!commit) {
            throw new HttpOKException(
                20003,
                `commit ${dto.commitHash ? dto.commitHash : ''}不存在`
            )
        }
        const commitUser = await model.manager.findOne(User, {
            where: {
                username: commit.username,
            },
        })
        const resData = new GetOneRepoCommitResDto()
        resData.data = {
            content: commit.comment,
            createTime: commit.time.getTime(),
            hash: commit.commitHash,
            username: commit.username,
        }
        if (commitUser) {
            resData.data.nickname = commitUser.nickname
            resData.data.userId = commitUser.id
        }
        return resData
    }
}
