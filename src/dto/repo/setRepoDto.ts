import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'
import { RepoType } from './share'

export class SetRepoReqDto {
    @ApiProperty({
        type: 'number',
    })
    repoId: number

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

    // 0 关闭。 1-6顺序
    @ApiProperty({
        type: 'number',
    })
    isOverview?: number
}

export class SetRepoResDto extends HttpResponse {}
