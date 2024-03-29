import { HttpResponse } from '../HttpResponse'
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
        type: 'number',
    })
    created_time: number

    @ApiProperty({
        type: 'number',
    })
    avatar_version: number

    @ApiProperty({
        type: 'string',
    })
    bio: string

    @ApiProperty({
        type: 'string',
    })
    org: string

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

export class InfoResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: InfoResData,
    })
    data: InfoResData
}
