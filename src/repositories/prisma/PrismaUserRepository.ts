import {ApplicationUserBody, UserRepository} from "../UserRepository";
import {ApplicationUser} from "@prisma/client";
import {prisma} from "@libs/database/prisma";

export class PrismaUserRepository implements UserRepository {
    create(data: ApplicationUserBody): Promise<ApplicationUser> {
        return prisma.applicationUser.create({ data });
    }

    findAll(): Promise<ApplicationUser[]> {
        return prisma.applicationUser.findMany();
    }

    findById(id: string): Promise<ApplicationUser | null> {
        return prisma.applicationUser.findUnique({ where: { id } });
    }

    findByEmail(email: string): Promise<ApplicationUser | null> {
        return prisma.applicationUser.findUnique({ where: { email } });
    }

    update(id: string, data: Partial<ApplicationUserBody>): Promise<ApplicationUser> {
        throw new Error("Method not implement!");
    }
}

export const prismaUserRepository = new PrismaUserRepository();
