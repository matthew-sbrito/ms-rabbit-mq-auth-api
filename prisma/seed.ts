import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
    const password = await bcrypt.hash("123456", 10);

    const user = await prisma.applicationUser.create({
        data: {
            name: "Matheus",
            email: "matheusbr032@gmail.com",
            password
        }
    })

    console.log(`User created with email: [${user.email}]`);
}

seed()
    .then(() => console.log("Seed done!"));