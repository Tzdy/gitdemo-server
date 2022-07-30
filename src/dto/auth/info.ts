import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class InfoReqDto {}

export class InfoResDataDto {
    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'string',
    })
    nickname: string
}

export class InfoResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'object',
    })
    data: InfoResDataDto
}
