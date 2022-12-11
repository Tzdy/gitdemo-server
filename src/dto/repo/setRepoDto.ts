import { RepoType } from '@/entity/Repo'
import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class SetRepoReqDto {
    @ApiProperty({
        type: 'string',
    })
    repoName?: string

    @ApiProperty({
        type: 'number',
    })
    type?: RepoType

    @ApiProperty({
        type: 'string',
    })
    about?: string

    @ApiProperty({
        type: 'boolean',
    })
    isOverview?: boolean

    @ApiProperty({
        type: 'string',
    })
    website?: string

    @ApiProperty({
        type: 'number',
    })
    languageId?: number
}

export class SetRepoResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number

    @ApiProperty({
        type: 'string',
    })
    message: string
}
