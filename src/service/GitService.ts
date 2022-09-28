export interface GitService {
    syncCommit(
        repoName: string,
        branchName: string,
        username: string,
        last: string
    ): Promise<void>
}
