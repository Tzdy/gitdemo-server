import { ApiProperty } from '@tsdy/express-plugin-swagger'

export enum RefType {
    BRANCH = 0,
    TAG = 1,
}

export class ListRepoRefReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'string',
    })
    repoName: string

    @ApiProperty({
        type: 'integer',
        example: `${RefType.BRANCH} branch, ${RefType.TAG} tag`,
    })
    type: RefType
}

class RefItem {
    @ApiProperty({
        type: 'string',
    })
    name: string

    @ApiProperty({
        type: 'string',
    })
    latestCommit: string
}

class Data {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            ref: RefItem,
        },
    })
    list: RefItem[]
}

export class ListRepoRefResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'string',
    })
    message: string = 'ok'

    @ApiProperty({
        type: 'object',
    })
    data: Data
}
