import {UserRepository} from "@repositories/UserRepository";
import {ResponseErrorException} from "@libs/error/response-error-exception";
import {ApplicationUser} from "@prisma/client";
import {Logger} from "@libs/../helpers/log/Logger";

import {prismaUserRepository} from "@repositories/prisma/PrismaUserRepository";

import httpStatus from "http-status-codes";

export class UserService {
    private readonly logger: Logger = Logger.createLogger(UserService.name);
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async findByEmail(email: string): Promise<ApplicationUser> {
        this.logger.info(`find User by email was called with email: [${email}]`);

        const user = await this.userRepository.findByEmail(email);

        if (user == null) {
            throw new ResponseErrorException(httpStatus.NOT_FOUND, "User not found!");
        }

        return user;
    }
}

export const userService = new UserService(prismaUserRepository);