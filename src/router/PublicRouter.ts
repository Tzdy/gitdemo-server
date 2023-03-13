import { ApiTag, Controller, Get, Query, Res } from '@/utils/decorator'
import { Response } from 'express'
import { resolve } from 'path'
import fs from 'fs/promises'

@ApiTag('Public')
@Controller('public')
export class PublicRouter {
    @Get('avatar')
    async avatar(@Query('id') id: string, @Res() res: Response) {
        res.setHeader('content-type', ' image/jpeg')
        try {
            await fs.stat(resolve(process.env.UPLOAD_INFO_AVATAR, id))
            res.sendFile(resolve(process.env.UPLOAD_INFO_AVATAR, id))
        } catch {
            res.sendFile(resolve('src', 'assets', 'img', 'avatar.png'))
        }
    }
}
