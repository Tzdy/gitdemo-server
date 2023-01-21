import { Commit } from '@/entity/Commit'
import { Item } from '@/entity/Item'
import { Repo } from '@/entity/Repo'
import { User } from '@/entity/User'
import { UserRepoRelation } from '@/entity/UserRepoRelation'
import { DataSource } from 'typeorm'
export const model = new DataSource({
    type: 'mysql',
    charset: 'utf8mb4',
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    entities: [User, Repo, Item, Commit, UserRepoRelation],
})

export const initialize = model.initialize.bind(model)
