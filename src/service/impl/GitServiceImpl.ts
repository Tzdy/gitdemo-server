import { User } from '@/entity/User'
import { model } from '@/model'
import { GitService } from '../GitService'
import { Git as GitUtil } from '@tsdy/git-util'
import { join } from 'path'
import { Repo } from '@/entity/Repo'
import { Commit } from '@/entity/Commit'
import { parseLanguage } from '@/utils/language'
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
        const allBranchList = await gitUtil.showRef()

        // 如果分支数为1并且last为00000可以认为是仓库初始化提交
        let isInitCommit = false
        if (allBranchList.length === 1 && /0{36}/.test(last)) {
            // 需要将HEAD移动到对应分支
            await gitUtil.updateHead(branchName)
            isInitCommit = true
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
        // 从最主要的往右找第一个非Other的
        // 实在没有就-1 就是Other
        const mainLanguageId = languageList.find(item => {
            const langItem = parseLanguage(item.language_id)
            if (langItem && langItem.language && langItem.color && langItem.language !== 'Other') {
                return true
            }
        })?.language_id || -1
        const repoUpdateVal: Partial<Repo> = {
            language_id: mainLanguageId,
            language_analysis: languageList,
        }
        // 如果是初始提交需要设置默认分支
        if (isInitCommit) {
            repoUpdateVal.default_branch_name = branchName
        }
        await model.manager.update(Repo, { id: repo.id }, repoUpdateVal)
    }
}
