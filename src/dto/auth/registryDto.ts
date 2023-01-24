import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { IsString, IsByteLength, IsAlpha } from 'class-validator'
import { HttpResponse } from '../HttpResponse'

export class RegisterReqDto {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @IsByteLength(3, 18)
    username: string

    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @IsByteLength(6, 12)
    password: string
}

export class RegisterResDto extends HttpResponse {}
