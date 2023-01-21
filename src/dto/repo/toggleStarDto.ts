import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class ToggleStarReqDto {
    @ApiProperty({
        type: 'number',
    })
    repoId: number
}

export class ToggleStarResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number

    @ApiProperty({
        type: 'string',
    })
    message: string
}
