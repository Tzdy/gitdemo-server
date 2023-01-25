import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'
import { RepoDto, RepoType } from './share'

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

export class ListRepoResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: ListRepoResData,
    })
    data: ListRepoResData
}
