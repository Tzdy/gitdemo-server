import { Git as GitUtil } from '@tsdy/git-util'
import path from 'path'

export function createGitUtil(username: string, repoName: string) {
    return new GitUtil(path.join(process.env.GIT_ROOT_PATH, username), repoName)
}
