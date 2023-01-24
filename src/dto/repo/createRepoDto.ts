import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'
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

export class CreateRepoResDto extends HttpResponse {}
