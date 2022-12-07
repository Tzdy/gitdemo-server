import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class ListRepoLanguageReqDto {
    @ApiProperty({
        type: 'number',
    })
    userId: number

    @ApiProperty({
        type: 'string',
    })
    repoName: string
}

class ResData {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
        },
    })
    languageList: Array<string>
}

export class ListRepoLanguageResDto {
    @ApiProperty({
        type: 'number',
    })
    userId: number

    @ApiProperty({
        type: 'object',
        ref: ResData,
    })
    data: ResData
}
