import { ApiProperty } from '@tsdy/express-plugin-swagger'

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

export class SetInfoResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'string',
    })
    message: string
}
