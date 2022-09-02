import { asyncException } from '@tsdy/express-plugin-exception'
import { ExpressSwagger } from '@tsdy/express-plugin-swagger'
import { validatorMiddleWare } from '@tsdy/express-plugin-validator'
import { Router } from 'express'
import { ListWHReqDto, ListWHResDto } from './dto/list_warehouse'
import { listWareHouse } from './service'

const router = Router()

router.post(
    '/list_warehouse',
    ExpressSwagger({
        tags: ['hello'],
        parameter: {
            in: 'body',
            dto: ListWHReqDto,
        },
        responses: {
            200: {
                dto: ListWHResDto,
            },
        },
    }),
    validatorMiddleWare(ListWHReqDto, 'body'),
    asyncException(listWareHouse)
)

export default router
