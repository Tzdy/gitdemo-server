import { ApiProperty } from '@tsdy/express-plugin-swagger'
import { HttpResponse } from '../HttpResponse'
import { ToggleState } from './share'

export class ToggleStarReqDto {
    @ApiProperty({
        type: 'number',
    })
    repoId: number

    @ApiProperty({
        type: 'integer',
    })
    state: ToggleState
}

export class ToggleStarResDto extends HttpResponse {}
