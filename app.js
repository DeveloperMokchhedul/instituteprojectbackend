import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import { MONGODB_CONNECTION, PORT, MAX_JSON_SIZE, URL_ENCODED, WEB_CACHE, REQUEST_LIMIT_NUMBER, REQUEST_LIMIT_TIME } from "./app/config/config.js";
import { dbConnected } from './app/utility/db.js';
import userRouter from "./routes/users.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/orderRoute.js";

const app = express();
dbConnected();

// Global Application Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

// const cors = require("cors");

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://bookcycle-qdl4.onrender.com"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));



const corsOptions = {
    origin: 'https://instituteproject.netlify.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
};

app.use(cors(corsOptions));





app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODED }));
app.use(hpp());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cookieParser());

// Rate Limiter
const limiter = rateLimit({
  windowMs: REQUEST_LIMIT_TIME,
  max: REQUEST_LIMIT_NUMBER,
});
app.use(limiter);

// Web Caching
app.set('etag', WEB_CACHE);


app.use("/api/user", userRouter);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);

// Run Your Express Back End Project
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
