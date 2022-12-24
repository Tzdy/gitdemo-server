import { RepoType } from '@/entity/Repo'
import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class CatRepoFileReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'string',
    })
    repoName: string

    // 可以是分支名或commitHash
    @ApiProperty({
        type: 'string',
    })
    branch: string

    @ApiProperty({
        type: 'string',
    })
    path: string
}

class Data {
    @ApiProperty({
        type: 'integer',
    })
    size: number

    @ApiProperty({
        type: 'string',
    })
    value: string
}

export class CatRepoFileResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number

    @ApiProperty({
        type: 'string',
    })
    message: string

    @ApiProperty({
        type: 'object',
        ref: Data,
    })
    data: Data
}
