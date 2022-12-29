import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { RepoType } from './share'

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
