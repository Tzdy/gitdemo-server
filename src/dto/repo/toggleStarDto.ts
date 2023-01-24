import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'

export class ToggleStarReqDto {
    @ApiProperty({
        type: 'number',
    })
    repoId: number
}

export class ToggleStarResDto extends HttpResponse {}
