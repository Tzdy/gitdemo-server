import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'

export class TreeCommitItem {
    @ApiProperty({
        type: 'string',
    })
    commitUser: string
    @ApiProperty({
        type: 'string',
    })
    commitTime: string
    @ApiProperty({
        type: 'string',
    })
    commitHash: string
    @ApiProperty({
        type: 'string',
    })
    commitContent: string
    @ApiProperty({
        type: 'string',
        example: 'blob | tree',
    })
    type: 'blob' | 'tree'
    @ApiProperty({
        type: 'string',
    })
    hash: string
    @ApiProperty({
        type: 'string',
    })
    name: string
    @ApiProperty({
        type: 'string',
    })
    path: string
}

export class ListRepoFileReqDto {
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
    path?: string
}

class ResData {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            ref: TreeCommitItem,
        },
    })
    list: Array<TreeCommitItem>
}

export class ListRepoFileResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: ResData,
    })
    data: ResData
}
