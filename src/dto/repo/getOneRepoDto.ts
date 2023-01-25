import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'
import { RepoDto, RepoType } from './share'

class LanguageItem {
    @ApiProperty({
        type: 'integer',
    })
    languageId: number

    @ApiProperty({
        type: 'string',
    })
    language: string

    @ApiProperty({
        type: 'integer',
    })
    fileNum: number
}

export class GetOneRepoReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'string',
    })
    repoName: string
}

class Data extends RepoDto {
    @ApiProperty({
        type: 'string',
    })
    website: string

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            ref: LanguageItem,
        },
    })
    languageAnalysis: LanguageItem[]
}

export class GetOneRepoResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: Data,
    })
    data: Data
}
