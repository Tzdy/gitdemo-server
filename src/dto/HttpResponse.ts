import { ApiProperty } from '@tsdy/express-plugin-swagger'

export class HttpResponse {
    @ApiProperty({
        type: 'number',
        example: '20000',
    })
    code: number = 20000

    @ApiProperty({
        type: 'string',
        example: 'ok',
    })
    message: string = 'ok'
}
