import {ApplicationUser} from "@prisma/client";

declare global {
    declare namespace Express {
        export interface Request {
            loggedUser: ApplicationUser
        }
    }
}