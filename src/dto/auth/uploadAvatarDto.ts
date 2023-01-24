import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'

export class UploadAvatarReqDto {}

class Data {
    @ApiProperty({
        type: 'number',
    })
    v: number
}

export class UploadAvatarResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: Data,
    })
    data: Data
}
