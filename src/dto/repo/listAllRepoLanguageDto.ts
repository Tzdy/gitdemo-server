import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class ListAllRepoLanguageReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string
}

class LanguageItem {
    @ApiProperty({
        type: 'number',
    })
    id: number

    @ApiProperty({
        type: 'string',
    })
    name: string
}

class ResData {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            ref: LanguageItem,
        },
    })
    languageList: Array<LanguageItem>
}

export class ListAllRepoLanguageResDto {
    @ApiProperty({
        type: 'object',
        ref: ResData,
    })
    data: ResData
}
