import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { RepoType } from './share'

export class CreateRepoReqDto {
    @ApiProperty({
        type: 'string',
    })
    repoName: string

    @ApiProperty({
        type: 'number',
    })
    type: RepoType

    @ApiProperty({
        type: 'string',
    })
    about: string
}

export class CreateRepoResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number

    @ApiProperty({
        type: 'string',
    })
    message: string
}
