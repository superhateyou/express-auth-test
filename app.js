import express from "express";
import mongoose from "mongoose";
import AuthRouter from "./AuthRouter.js";

const PORT = process.env.PORT || 5000;

const DB_URL = 'mongodb+srv://user:X3S0GBzX6vo4nwRz@cluster0.tjmqlwl.mongodb.net/?retryWrites=true&w=majority';

const app = express();
app.use(express.json());
app.use('/auth', AuthRouter)

async function startApp() {
    try {
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => console.log("Server started on port!" + PORT));
    } catch (e) {
        console.log(e);
    }
}

startApp();