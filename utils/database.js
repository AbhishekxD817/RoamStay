import mongoose from "mongoose";

const connectDatabase = async () =>{
    try {
        let db = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log('==> Mongo Database is connected')

    } catch(error) {
        console.log(error.message)
    }
}

export default connectDatabase;