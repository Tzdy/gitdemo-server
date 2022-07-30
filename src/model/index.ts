import mongoose from 'mongoose'
export async function mongodbInit() {
    await mongoose.connect(process.env.DB_URL)
}
