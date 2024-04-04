import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import indexRouter from "./routes/indexRoute.js";
import { connectToDB } from "./lib/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

// log the request
app.use(morgan("dev"));

app.use(express.json());

// Database Connection
await connectToDB();

// Handling Routes
app.use("/api/v1", indexRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on : ${PORT}`));
