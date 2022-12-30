import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class UploadAvatarReqDto {}

class Data {
    @ApiProperty({
        type: 'number',
    })
    v: number
}

export class UploadAvatarResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'object',
        ref: Data,
    })
    data: Data
}
