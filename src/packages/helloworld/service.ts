import { model } from '@/model'
import { Request, Response } from 'express'
import { ListWHResDto } from './dto/list_warehouse'
import { HelloWorld } from './model'

export async function listWareHouse(req: Request, res: Response) {
    await model.manager.insert(HelloWorld, {})

    const rs = new ListWHResDto()
    res.send(rs)
}
