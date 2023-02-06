import {userService, UserService} from "@services/UserService";
import {Request, Response} from "express";
import {ResponseErrorException} from "@libs/error/response-error-exception";
import {ApplicationUser} from "@prisma/client";

import httpStatus from "http-status-codes";

export class UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
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

export const userController = new UserController(userService);