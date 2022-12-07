import { Repo, RepoType } from '@/entity/Repo'
import { ApiProperty } from '@tsdy/express-plugin-swagger'

export enum ListRepoSortType {
    REPO_NAME = 0,
    STAR = 1,
}

export class ListRepoReqDto {
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
        type: 'string',
    })
    language?: string

    @ApiProperty({
        type: 'string',
    })
    keyword?: string
}

export class RepoDto {
    @ApiProperty({
        type: 'number',
    })
    id: number

    @ApiProperty({
        type: 'string',
    })
    name: string

    @ApiProperty({
        type: 'number',
    })
    type: RepoType
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
