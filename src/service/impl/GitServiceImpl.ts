import { User } from '@/entity/User'
import { model } from '@/model'
import { GitService } from '../GitService'
import { Git as GitUtil } from '@tsdy/git-util'
import { join } from 'path'
import { Repo } from '@/entity/Repo'
import { Commit } from '@/entity/Commit'
export class GitServiceImpl implements GitService {
    async syncCommit(
        repoName: string,
        branchName: string,
        username: string,
        last: string
    ): Promise<void> {
        const user = await model.manager.findOne(User, {
            where: {
                username,
            },
        })
        if (!user) {
            throw new Error('user is not exist.')
        }
        const gitUtil = new GitUtil(
            join(process.env.GIT_ROOT_PATH, username),
            repoName
        )
        const repo = await model.manager.findOne(Repo, {
            where: {
                user_id: user.id,
                repo_name: repoName,
            },
        })
        if (!repo) {
            throw new Error(`the repo ${repoName} is not exist.`)
        }
        const allBranchList = await gitUtil.findBranch()

        // 如果分支数为1并且last为00000可以认为是仓库初始化提交，需要将HEAD移动到对应分支
        if (allBranchList.length === 1 && /0{36}/.test(last)) {
            await gitUtil.updateHead(branchName)
        }
        const allCommitList = await gitUtil.findAllCommitHash(branchName)
        const commitHashList = (
            await model.manager.find(Commit, {
                select: ['commit_hash'],
                where: {
                    user_id: user.id,
                    repo_id: repo.id,
                },
            })
        ).map((c) => c.commit_hash)
        const set = new Set()
        commitHashList.forEach((commitHash) => set.add(commitHash))
        const diffCommitList = allCommitList.filter(
            (commitHash) => !set.has(commitHash)
        )
        const commitArr = diffCommitList.map((commitHash) => {
            const commitEntity = new Commit()
            commitEntity.commit_hash = commitHash
            commitEntity.repo_id = repo.id
            commitEntity.user_id = user.id
            return commitEntity
        })
        await model.manager.insert(Commit, commitArr)
        const itemList = await gitUtil.findDiffItem(
            diffCommitList.map((commitHash) => commitHash)
        )
        const languageList = repo.language_analysis
        itemList.forEach((item) => {
            const langItem = languageList.find(
                (lang) => lang.language_id === item.langId
            )
            if (langItem) {
                langItem.file_num += 1
            } else {
                languageList.push({
                    language_id: item.langId,
                    file_num: 1,
                })
            }
        })
        languageList.sort((a, b) => b.file_num - a.file_num)
        await model.manager.update(
            Repo,
            { id: repo.id },
            {
                language_id: languageList[0].language_id,
                language_analysis: languageList,
            }
        )
    }
}
