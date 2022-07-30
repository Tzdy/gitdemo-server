import { UserModel, User } from '@/model/user'

export const UserDao = {
    async findOneByUsername(username: string) {
        const user = await UserModel.findOne({
            username,
        })
        return user?.toObject()
    },

    async findOneById(_id: string) {
        const user = await UserModel.findOne({
            _id,
        })
        return user?.toObject()
    },

    async createOne(user: User) {
        const item = await UserModel.create(user)
        return item.toObject()
    },
}
