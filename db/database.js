import { MongoClient } from "mongodb";

let db;

const connectDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGO_URI);

        // const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();

        db = client.db("DT2");
        console.log("MongoDB Connected");


    } catch (error) {
        console.log(`MongoDB connection Failed : ${error}`);
        process.exit(1);
    }
};

const getDb = () => db;

export {
    connectDB,
    getDb
}
