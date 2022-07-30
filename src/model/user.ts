import { Schema, model, SchemaDefinition } from 'mongoose'

export class User {
    _id: string
    username: string
    password: string
    nickname: string
}

export const userDefinition: Required<SchemaDefinition<User>> = {
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        unique: true,
        required: true,
    },
}

const schema = new Schema<User>(userDefinition)

export const UserModel = model<User>('users', schema)
