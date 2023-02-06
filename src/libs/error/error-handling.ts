import {NextFunction, Request, Response} from "express";
import {ResponseErrorException} from "./response-error-exception";

import httpStatus, {getReasonPhrase} from "http-status-codes";

export interface ResponseError {
    status: number
    message: string
    reason: string
    timestamp: string
}

export function errorHandling(error: Error, request: Request, response: Response, next: NextFunction): Response {
    console.log("Error handling was called!")
    console.log(error.message)

    const status  = (error instanceof ResponseErrorException) ? error.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
    const message = (error instanceof ResponseErrorException) ? error.message    : "Unknown error!";
    const reason  = getReasonPhrase(status);
    const timestamp = new Date();

    return response
        .status(status)
        .json({status, reason, message, timestamp})
}