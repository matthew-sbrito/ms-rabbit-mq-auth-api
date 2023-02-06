import {Repository} from "./Repository";
import {ApplicationUser} from "@prisma/client";

export interface ApplicationUserBody {
    name: string
    email: string
    password: string
}

export interface UserRepository extends Repository<ApplicationUser, string, ApplicationUserBody> {
    findByEmail(email: string): Promise<ApplicationUser | null>
}