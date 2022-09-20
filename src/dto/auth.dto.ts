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

export class InfoReqDto {}

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
        type: 'string',
    })
    created_time: Date

    @ApiProperty({
        type: 'string',
    })
    avatar: string

    @ApiProperty({
        type: 'string',
    })
    bio: string

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

export class InfoResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'object',
        ref: InfoResData,
    })
    data: InfoResData
}

export class RegisterReqDto {
    @ApiProperty({
        type: 'string',
    })
    @IsString()
    @IsByteLength(6, 12)
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

// set info

export class SetInfoReqDto {
    @ApiProperty({
        type: 'string',
    })
    nickname: string

    @ApiProperty({
        type: 'string',
    })
    avatar: string

    @ApiProperty({
        type: 'string',
    })
    bio: string

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
