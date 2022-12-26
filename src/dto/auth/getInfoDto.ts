import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class InfoReqDto {}

export class OtherInfoReqDto {
    @ApiProperty({
        type: 'string',
    })
    username: string
}

export class InfoDto {
    @ApiProperty({
        type: 'integer',
    })
    id: number

    @ApiProperty({
        type: 'string',
    })
    username: string

    @ApiProperty({
        type: 'string',
    })
    nickname: string

    @ApiProperty({
        type: 'string',
    })
    created_time: Date

    @ApiProperty({
        type: 'string',
    })
    avatar: string

    @ApiProperty({
        type: 'string',
    })
    bio: string

    @ApiProperty({
        type: 'string',
    })
    address: string

    @ApiProperty({
        type: 'string',
    })
    link: string

    @ApiProperty({
        type: 'string',
    })
    twitter: string
}

class InfoResData {
    @ApiProperty({
        type: 'object',
        ref: InfoDto,
    })
    info: InfoDto
}

export class InfoResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'object',
        ref: InfoResData,
    })
    data: InfoResData
}
