import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { IsString, IsByteLength } from 'class-validator'

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

export class LoginResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'object',
        ref: LoginResData,
    })
    data?: LoginResData
}
