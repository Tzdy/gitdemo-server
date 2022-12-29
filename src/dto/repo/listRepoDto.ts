import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { RepoType } from './share'

export enum ListRepoSortType {
    LAST_UPDATE = 0,
    NAME = 1,
    STAR = 2,
}

export class ListRepoReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'number',
    })
    page: number

    @ApiProperty({
        type: 'number',
    })
    pageSize: number

    @ApiProperty({
        type: 'number',
        example: '0 Public, 2 Private',
    })
    repoType?: RepoType

    @ApiProperty({
        type: 'number',
        example: '0 reponame, 1 star',
    })
    sort?: ListRepoSortType

    @ApiProperty({
        type: 'number',
    })
    languageId?: number

    @ApiProperty({
        type: 'string',
    })
    keyword?: string

    @ApiProperty({
        type: 'boolean',
    })
    isOverview?: boolean
}

export class RepoDto {
    @ApiProperty({
        type: 'number',
    })
    id: number

    @ApiProperty({
        type: 'number',
    })
    type: RepoType

    @ApiProperty({
        type: 'string',
    })
    repo_name: string

    @ApiProperty({
        type: 'string',
    })
    create_time: number

    @ApiProperty({
        type: 'number',
    })
    star_num: number

    @ApiProperty({
        type: 'integer',
    })
    is_overview: number

    @ApiProperty({
        type: 'string',
    })
    about: string

    // 提交时间，不是commit time
    @ApiProperty({
        type: 'string',
    })
    update_time: number

    // 创建仓库时为空
    @ApiProperty({
        type: 'string',
    })
    language: string
}

class ListRepoResData {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            ref: RepoDto,
        },
    })
    repoList: Array<RepoDto>
}

export class ListRepoResDto {
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
        ref: ListRepoResData,
    })
    data: ListRepoResData
}
