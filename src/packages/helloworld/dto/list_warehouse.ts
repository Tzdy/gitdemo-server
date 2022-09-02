import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { IsByteLength } from 'class-validator'

export class ListWHReqDto {
    @IsByteLength(1, 16)
    @ApiProperty({
        type: 'string',
    })
    hhId: string
}

export class WHItem {
    @ApiProperty({
        type: 'string',
    })
    name: string
}

export class WHResData {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            ref: WHItem,
        },
    })
    list: Array<WHItem> = []
}

export class ListWHResDto {
    @ApiProperty({
        type: 'number',
    })
    code: number = 20000

    @ApiProperty({
        type: 'string',
    })
    message: string

    @ApiProperty({
        type: 'object',
        ref: WHResData,
    })
    data: WHResData = {
        list: [],
    }
}
