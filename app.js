import express from "express";

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

import eventRouter from "./routes/event.route.js";

app.use("/api/v3/app",eventRouter);

export { app }