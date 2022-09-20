import { AuthServiceImpl } from '@/service/impl/AuthServiceImpl'
import { Controller, Req, RequestMapper, Res } from '@/utils/decorator'
import { Request, Response } from 'express'
import { Git } from 'node-git-server'
import { Git as GitUtil } from '@tsdy/git-util'

@Controller('git')
export class GitRouter extends Git {
    constructor(private readonly authService: AuthServiceImpl) {
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
            push.res.on('finish', async function () {
                const gitUtil = new GitUtil(
                    process.env.GIT_ROOT_PATH,
                    push.repo
                )
                const branchList = await gitUtil.findBranch()
                if (branchList.length === 1 && /0{36}/.test(push.last)) {
                    await gitUtil.updateHead(push.branch)
                }
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
