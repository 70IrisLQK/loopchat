import dotenv from "dotenv";

dotenv.config();
const allowedOrigins = process.env.CLIENT_URL;

const corsOptions = {
  origin: [allowedOrigins],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import databaseConnect from "./config/DatabaseConfig.js";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

app.use("/", (req, res) => {
  res.send("Server running...");
});

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Basic error handling for server errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err || "Internal Server Error" });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

setupSocket(server);

// Connect to MongoDB
databaseConnect();
