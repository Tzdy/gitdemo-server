import { User } from '@/entity/User'
import { model } from '@/model'
import { GitService } from '../GitService'
import { Git as GitUtil } from '@tsdy/git-util'
import { join } from 'path'
import { Repo } from '@/entity/Repo'
import { Commit } from '@/entity/Commit'
import { Item } from '@/entity/Item'
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
        const allCommitList = await gitUtil.findCommit(branchName)
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
            (commit) => !set.has(commit.commitHash)
        )
        const commitArr = diffCommitList.map((commit) => {
            const commitEntity = new Commit()
            commitEntity.commit_hash = commit.commitHash
            commitEntity.repo_id = repo.id
            commitEntity.user_id = user.id
            return commitEntity
        })
        await model.manager.insert(Commit, commitArr)
        const itemList = await gitUtil.findDiffItem(
            diffCommitList.map((commit) => commit.commitHash)
        )
        await model.manager.insert(
            Item,
            itemList.map((item) => {
                const itemEntity = new Item()
                itemEntity.commit_body = item.comment
                itemEntity.commit_hash = item.commitHash
                itemEntity.commit_time = item.time
                itemEntity.committer_name = item.username
                itemEntity.hash = item.hash
                itemEntity.repo_id = repo.id
                itemEntity.user_id = user.id
                return itemEntity
            })
        )
    }
}
