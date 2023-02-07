import {userService, UserService} from "@services/UserService";
import {Request, Response} from "express";
import {ResponseErrorException} from "@libs/error/response-error-exception";
import {ApplicationUser} from "@prisma/client";

import httpStatus from "http-status-codes";
import {ApplicationUserBody} from "@repositories/UserRepository";
import {AuthenticationService, authenticationService} from "@services/AuthenticationService";

export class UserController {
    private userService: UserService;
    private authenticationService: AuthenticationService;

    constructor(userService: UserService, authenticationService: AuthenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }

    async create(request: Request, response: Response): Promise<Response> {
        const data = this.validateData(request);
        const user = await this.userService.create(data);
        const responseBody = this.authenticationService.generateAuthenticationResponse(user);

        return response.status(httpStatus.CREATED).json(responseBody)
    }

    async findByEmail(request: Request, response: Response): Promise<Response> {
        const email = this.validateArgument(request);

        const user = await this.userService.findByEmail(email);

        this.validateIfReallyUser(user, request.loggedUser);

        if (user == null) {
            throw new ResponseErrorException(httpStatus.NOT_FOUND, "User not found!");
        }

        return response.status(httpStatus.OK).json({
            ...user,
            password: undefined
        })
    }

    private validateData(request: Request): ApplicationUserBody {
        const {name, email, password} = request.body;

        if (name == null)
            throw new ResponseErrorException(httpStatus.BAD_REQUEST, "Name isn't valid!");
        if (email == null || !email.includes("@"))
            throw new ResponseErrorException(httpStatus.BAD_REQUEST, "Email isn't valid!");
        if (password == null)
            throw new ResponseErrorException(httpStatus.BAD_REQUEST, "Password isn't valid!");

        return {
            name,
            email,
            password
        };
    }

    private validateArgument(request: Request): string {
        const {email} = request.params;

        if (email == null || !email.includes("@"))
            throw new ResponseErrorException(httpStatus.BAD_REQUEST, "Email isn't valid!");

        return email;
    }

    private validateIfReallyUser(user: ApplicationUser | null, loggedUser: ApplicationUser | null) {
        if (!user || !loggedUser || user.id != loggedUser.id)
            throw new ResponseErrorException(httpStatus.FORBIDDEN, "You don't have permission for access this action!")
    }
}

export const userController = new UserController(userService, authenticationService);