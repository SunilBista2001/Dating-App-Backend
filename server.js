import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import indexRouter from "./routes/indexRoute.js";
import { connectToDB } from "./lib/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;

// log the request
app.use(morgan("dev"));

app.use(express.json());

const whitelist = ["http://localhost:5173", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Database Connection
await connectToDB();

// Handling Routes
app.use("/api/v1", indexRouter);

app.use(errorHandler);

server.listen(PORT, () => console.log(`Server is running on : ${PORT}`));
