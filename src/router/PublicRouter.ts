import { ApiTag, Controller, Get, Query, Res } from '@/utils/decorator'
import { Response } from 'express'
import { resolve } from 'path'

@ApiTag('Public')
@Controller('public')
export class PublicRouter {
    @Get('avatar')
    async avatar(@Query('id') id: string, @Res() res: Response) {
        res.setHeader('content-type', ' image/jpeg')
        res.sendFile(resolve(process.env.UPLOAD_INFO_AVATAR, id))
    }
}
