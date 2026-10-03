import express from 'express';
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use("/api" , chatRoutes);

app.listen(port , () => {
    console.log(`server is listening to port ${port}`);
    connectDB();
})

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to DB");
    }

    catch(err){
        console.log(err);
    }
}