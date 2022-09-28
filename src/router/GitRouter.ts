import { AuthServiceImpl } from '@/service/impl/AuthServiceImpl'
import { Controller, Req, RequestMapper, Res } from '@/utils/decorator'
import { Request, Response } from 'express'
import { Git, parseGitName } from 'node-git-server'
import { Git as GitUtil } from '@tsdy/git-util'
import { RepoServiceImpl } from '@/service/impl/RepoServiceImpl'
import { join } from 'path'
import { GitServiceImpl } from '@/service/impl/GitServiceImpl'

@Controller('git')
export class GitRouter extends Git {
    constructor(
        private readonly authService: AuthServiceImpl,
        private readonly gitService: GitServiceImpl
    ) {
        super(process.env.GIT_ROOT_PATH, {
            autoCreate: false,
            authenticate: ({ type, repo, user }, next) => {
                if (type === 'push') {
                    user(async (username, password) => {
                        if (username && password) {
                            try {
                                await this.authService.login(username, password)
                                next()
                            } catch (err: any) {
                                next(err.message)
                            }
                        } else {
                            next(
                                new Error('please input username and password')
                            )
                        }
                    })
                } else {
                    next()
                }
            },
        })
        this.on('push', (push) => {
            push.res.on('finish', async () => {
                const repoName = parseGitName(push.repo.split('/')[1])
                const branchName = push.branch
                const last = push.last
                const username = push.username
                await this.gitService.syncCommit(
                    repoName,
                    branchName,
                    username,
                    last
                )
            })
            push.accept()
        })
        this.on('fetch', (fetch) => fetch.accept())
    }

    @RequestMapper('*')
    async request(@Req() req: Request, @Res() res: Response) {
        this.handle(req, res)
    }
}
