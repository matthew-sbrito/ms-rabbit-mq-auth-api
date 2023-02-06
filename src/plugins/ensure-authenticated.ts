import {prisma} from "@libs/database/prisma";
import {NextFunction, Request, Response} from "express";
import {ResponseErrorException} from "@libs/error/response-error-exception";
import {JWTSecret} from "@libs/jwt-configuration";

import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";

interface Payload {
    userId: string
}

const AUTHORIZATION_PREFIX = "Bearer ";

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    if(request.url == "/api/authenticate") return next();

    const { authorization } = request.headers;

    if(authorization == null || !authorization.includes(AUTHORIZATION_PREFIX))
        throw new ResponseErrorException(httpStatus.UNAUTHORIZED, "Token is missing!");

    const accessToken = authorization.replace(AUTHORIZATION_PREFIX, "")

    try {
        const { userId } = jwt.verify(accessToken, JWTSecret) as Payload;

        await loadUserByUserIdFromToken(request, userId);

        return next();
    } catch (error) {
        throw new ResponseErrorException(httpStatus.UNAUTHORIZED, "Token is missing!");
    }
}

async function loadUserByUserIdFromToken(request: Request, userId: string) {
    const user = await prisma.applicationUser.findFirst({ where: { id: userId } });

    if(user == null)
        throw new ResponseErrorException(httpStatus.UNAUTHORIZED, "User not exists!")

    request.loggedUser = user;
}