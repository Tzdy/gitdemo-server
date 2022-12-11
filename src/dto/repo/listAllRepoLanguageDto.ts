import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class ListAllRepoLanguageReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string
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

export class ListAllRepoLanguageResDto {
    @ApiProperty({
        type: 'object',
        ref: ResData,
    })
    data: ResData
}
