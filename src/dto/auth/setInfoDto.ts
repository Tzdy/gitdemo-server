import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'

// set info

export class SetInfoReqDto {
    @ApiProperty({
        type: 'string',
    })
    nickname?: string

    @ApiProperty({
        type: 'string',
    })
    bio?: string

    @ApiProperty({
        type: 'string',
    })
    address?: string

    @ApiProperty({
        type: 'string',
    })
    link?: string

    @ApiProperty({
        type: 'string',
    })
    twitter?: string

    @ApiProperty({
        type: 'string',
    })
    org?: string
}

export class SetInfoResDto extends HttpResponse {}
