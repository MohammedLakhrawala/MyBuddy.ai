import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connectDb from "./configs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js"


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const port = process.env.PORT || 8000
app.use(express.json());


app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)


app.get("/", (req, res) => {
    res.send("hi")
})

app.listen(port, ()=>{
    connectDb();
    console.log("server started")

})