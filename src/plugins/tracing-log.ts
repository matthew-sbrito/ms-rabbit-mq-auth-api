import {NextFunction, Request, Response} from "express";
import {ResponseErrorException} from "@libs/error/response-error-exception";
import {Logger} from "@libs/../helpers/log/Logger";
import {v4 as uuid} from "uuid";

import httpStatus from "http-status-codes";

const logger = Logger.createLogger("tracing-log.ts")

export function tracingLog(request: Request, response: Response, next: NextFunction) {
    const {transactionId} = request.headers;

    if (!(typeof transactionId == "string") || transactionId == "")
        throw new ResponseErrorException(httpStatus.BAD_REQUEST, "The transaction id header is required!")

    const serviceId = uuid();

    logger.info(messageLog(request, transactionId, serviceId, request.body))

    response.on("data", (chunk: any) => {
        logger.info(messageLog(request, transactionId, serviceId, chunk, false))
    });

    response.on("error", (err: Error) => {
        logger.error(messageLog(request, transactionId, serviceId, err, false))
    });

    return next();
}

function messageLog(request: Request, transactionId: string, serviceId: string, data: any, isRequest: boolean = true) {
    const type = isRequest ? "REQUEST" : "RESPONSE";

    return `[${transactionId}] [${serviceId}] [${type}] [${request.method}] [${request.url}] [${JSON.stringify(data)}]`
}