import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'

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

    @ApiProperty({
        type: 'number',
    })
    raw?: number
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

export class CatRepoFileResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: Data,
    })
    data: Data
}
