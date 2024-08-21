import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import triggerRouter from "./routes/trigger";
import actionRouter from "./routes/action";
import zapRouter from "./routes/zap";
import userRouter from "./routes/user";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/zap",zapRouter);
app.use("/api/v1/trigger",triggerRouter);
app.use("/api/v1/action",actionRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});