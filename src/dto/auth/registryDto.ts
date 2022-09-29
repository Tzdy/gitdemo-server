import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { IsString, IsByteLength, IsAlpha } from 'class-validator'

export class RegisterReqDto {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @IsAlpha()
    @IsByteLength(3, 18)
    username: string

    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @IsByteLength(6, 12)
    password: string
}

export class RegisterResDto {
    @ApiProperty({
        type: 'number',
        example: '20000 | 20001',
    })
    code: number = 20000

    @ApiProperty({
        type: 'string',
    })
    message: string
}
