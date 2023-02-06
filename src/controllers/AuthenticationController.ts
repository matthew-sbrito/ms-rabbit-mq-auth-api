import {authenticationService, AuthenticationService} from "@services/AuthenticationService";
import {Request, Response} from "express";
import {ResponseErrorException} from "@libs/error/response-error-exception";

import httpStatus from "http-status-codes";

interface AuthenticateRequest {
    email: string;
    password: string;
}

export class AuthenticationController {
    private authenticationService: AuthenticationService;

    constructor(authenticationService: AuthenticationService) {
        this.authenticationService = authenticationService;
    }

    async authenticate(request: Request, response: Response): Promise<Response> {
        const { email, password } = this.validateArgument(request);

        const responseBody = await this.authenticationService.authenticateUser(email, password);

        return response
            .status(httpStatus.OK)
            .json(responseBody);
    }

    private validateArgument(request: Request): AuthenticateRequest {
        const {email, password} = request.body;

        if (email == null || !email.includes("@"))
            throw new ResponseErrorException(httpStatus.UNAUTHORIZED, "Email isn't valid!");

        if (password == null)
            throw new ResponseErrorException(httpStatus.UNAUTHORIZED, "Password isn't valid!");

        return {email, password};
    }
}

export const authenticationController = new AuthenticationController(authenticationService);