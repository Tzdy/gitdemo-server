import { HelloWorld } from '@/packages/helloworld/model'
import { DataSource } from 'typeorm'
export const model = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    entities: [HelloWorld],
})

export const initialize = model.initialize.bind(model)
