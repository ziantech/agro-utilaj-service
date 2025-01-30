import mongoose from "mongoose";

export const connectDbProd = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI_PROD as string);
        console.log('Database connected!')
    } catch (error) {
        console.error('MongoDb connection failed', error);
        process.exit(1)
    }
}

export const connectDbDev = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI_DEV as string);
        console.log('Database connected! Test DB')
    } catch (error) {
        console.error('MongoDb connection failed', error);
        process.exit(1)
    }
}