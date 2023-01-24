import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'
import { RepoType } from './share'

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

class Data {
    @ApiProperty({
        type: 'integer',
    })
    id: number

    @ApiProperty({
        type: 'integer',
        example: `${RepoType.PUBLIC} public, ${RepoType.PRIVATE} private`,
    })
    type: RepoType

    @ApiProperty({
        type: 'string',
    })
    repoName: string

    @ApiProperty({
        type: 'integer',
    })
    createTime: number

    @ApiProperty({
        type: 'integer',
    })
    starNum: number

    @ApiProperty({
        type: 'integer',
        example: '1-6表示展示顺序。0表示非展示仓库',
    })
    isOverview: number

    @ApiProperty({
        type: 'string',
    })
    abount: string

    @ApiProperty({
        type: 'string',
    })
    website: string

    @ApiProperty({
        type: 'integer',
    })
    updateTime: number

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
