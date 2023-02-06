import "express-async-errors";
import "dotenv/config";

import express from 'express';
import cors from 'cors';

import {userRouter} from "@routes/user-router";
import {errorHandling} from "@libs/error/error-handling";
import {ensureAuthenticated} from "@plugins/ensure-authenticated";
import {tracingLog} from "@plugins/tracing-log";
import {Logger} from "@helpers/log/Logger";

const logger = Logger.createLogger("server.ts")

const app = express();
const env = process.env;
const PORT = env.PORT ?? 8080;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/status", (request, response) => {
    return response.status(200).json({ service: 'Auth API', status: "UP" });
})

app.use(tracingLog);
app.use(ensureAuthenticated);

app.use(userRouter);

app.use(errorHandling);

app.listen(PORT, () => logger.info(`Server is running in port ${PORT}`));