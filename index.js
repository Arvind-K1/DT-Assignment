import { configDotenv } from "dotenv";
import { connectDB } from "./db/database.js";
import { app } from "./app.js"

configDotenv({
    path: './.env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })