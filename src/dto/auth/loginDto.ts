import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { IsString, IsByteLength } from 'class-validator'
import { HttpResponse } from '../HttpResponse'

export class LoginReqDto {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @IsByteLength(6, 12)
    username: string = ''

    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @IsByteLength(6, 12)
    password: string = ''
}

class LoginResData {
    @ApiProperty({
        type: 'string',
    })
    token: string
}

export class LoginResDto extends HttpResponse {
    @ApiProperty({
        type: 'object',
        ref: LoginResData,
    })
    data?: LoginResData
}
