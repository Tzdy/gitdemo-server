import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'

export class GetOneRepoCommitReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'string',
    })
    repoName: string

    @ApiProperty({
        type: 'string',
    })
    branch: string

    @ApiProperty({
        type: 'string',
        example: 'string, 不写表示获取最新commit',
    })
    commitHash?: string
}

class Data {
    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'number',
    })
    userId?: number

    @ApiProperty({
        type: 'string',
    })
    nickname?: string

    @ApiProperty({
        type: 'string',
    })
    hash: string

    @ApiProperty({
        type: 'string',
    })
    content: string

    @ApiProperty({
        type: 'number',
    })
    createTime: number

    @ApiProperty({
        type: 'number',
    })
    totalCommitNum: number
}

export class GetOneRepoCommitResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: Data,
    })
    data: Data
}
