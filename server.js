import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import indexRouter from "./routes/indexRoute.js";
import { connectToDB } from "./lib/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

// log the request
app.use(morgan("dev"));

app.use(bodyParser.json({ limit: "10mb" }));

app.use(express.json());

const whitelist = [
  "http://localhost:3000",
  // "https://661fc1492b5122321b6c4f08--superlative-rugelach-3c684f.netlify.app/",
];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from any origin
    callback(null, true);
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
