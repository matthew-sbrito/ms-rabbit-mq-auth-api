import {UserRepository} from "@repositories/UserRepository";
import {ResponseErrorException} from "@libs/error/response-error-exception";
import {ApplicationUser} from "@prisma/client";
import {prismaUserRepository} from "@repositories/prisma/PrismaUserRepository";
import {JWTSecret} from "@libs/jwt-configuration";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";

interface AuthenticateResponse {
    user: Omit<ApplicationUser, "password">
    accessToken: string
}


export class AuthenticationService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async authenticateUser(email: string, password: string): Promise<AuthenticateResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (user == null)
            throw new ResponseErrorException(httpStatus.UNAUTHORIZED, "Email is incorrect in our database!");

        await this.validatePassword(password, user.password);

        return this.generateAuthenticationResponse(user);
    }

    generateAuthenticationResponse(user: ApplicationUser): AuthenticateResponse {
        const accessToken = this.generateToken(user);

        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
    }

    private async validatePassword(password: string, hash: string) {
        const isMatch = await bcrypt.compare(password, hash)

        if (!isMatch)
            throw new ResponseErrorException(httpStatus.UNAUTHORIZED, "Password is incorrect!")
    }

    private generateToken(user: ApplicationUser) {
        return jwt.sign({userId: user.id}, JWTSecret, {expiresIn: '1d'});
    }
}

export const authenticationService = new AuthenticationService(prismaUserRepository);