import { HttpException } from '@tsdy/express-plugin-exception'

export class HttpOKException extends HttpException {
    constructor(code: number, message: string) {
        super(200, message)
        this.resData.code = code
    }
}
