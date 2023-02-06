import {ApplicationUserBody, UserRepository} from "../UserRepository";
import {ApplicationUser} from "@prisma/client";
import {randomString} from "@helpers/random-string";

import bcrypt from "bcrypt";

export class MockUserRepository implements UserRepository {
    private users: ApplicationUser[] = []

    constructor() {
        this.loadDefaultUser()
            .then();
    }

    async loadDefaultUser(): Promise<void> {
        this.users.push({
            id: randomString(),
            name: "Matheus Brito",
            email: "matheusbr032@gmail.com",
            password: await bcrypt.hash("123456", 10)
        })
    }

    async create(data: ApplicationUserBody): Promise<ApplicationUser> {
        const userAlreadyExists = await this.findByEmail(data.email);

        if(userAlreadyExists)
            throw new Error(`User with email ${data.email} already exists!`)

        const id = await this.generateID();

        const user = {...data, id, password: await bcrypt.hash(data.password, 10)};
        this.users.push(user);

        return user;
    }

    private async generateID() {
        let id = "";

        while (id == "") {
            const generateId = randomString();
            id = (await this.findById(generateId)) ? "" : generateId;
        }

        return id;
    }

    async findAll(): Promise<ApplicationUser[]> {
        return Promise.resolve(this.users);
    }

    async findById(id: string): Promise<ApplicationUser | null> {
        const user = this.users.find(user => user.id == id) ?? null;
        return Promise.resolve(user);
    }

    findByEmail(email: string): Promise<ApplicationUser | null> {
        const user = this.users.find(user => user.email == email) ?? null;
        return Promise.resolve(user);
    }

    async update(id: string, data: Partial<ApplicationUserBody>): Promise<ApplicationUser> {
        const user = await this.findById(id);

        if (!user) throw new Error("");

        const userUpdated = Object.assign(data, user);

        this.users = this.users.filter(user => user.id != userUpdated.id);
        this.users.push(userUpdated);

        return userUpdated;
    }


}