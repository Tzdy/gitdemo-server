import { CreateRepoReqDto, CreateRepoResDto } from '@/dto/repo/createRepoDto'
import { Repo } from '@/entity/Repo'
import { User } from '@/entity/User'
import { model } from '@/model'
import { HttpAuthException, HttpOKException } from '@/utils/exception'
import { Git } from '@tsdy/git-util'
import { join } from 'path'
import { RepoService } from '../RepoService'

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
        createRepoResDto.message = '创建成功'
        return createRepoResDto
    }
}
