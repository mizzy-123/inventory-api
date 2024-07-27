import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
    const password = await bcrypt.hash("1234567890", 10);
    const mizzy = await prisma.user.upsert({
        where: { email: "mizzy12342@gmail.com" },
        update: {},
        create: {
            email: "mizzy12342@gmail.com",
            username: "Mizzy",
            password: password,
            roles: {
                create: {
                    admin: true,
                },
            },
        },
    });

    await prisma.userData.upsert({
        where: {
            users_id: mizzy.id,
        },
        update: {},
        create: {
            users_id: mizzy.id,
        },
    });

    const eka = await prisma.user.upsert({
        where: { email: "eka@gmail.com" },
        update: {},
        create: {
            email: "eka@gmail.com",
            username: "Eka",
            password: password,
            roles: {
                create: {
                    manager: true,
                },
            },
        },
    });

    await prisma.userData.upsert({
        where: {
            users_id: eka.id,
        },
        update: {},
        create: {
            users_id: eka.id,
        },
    });

    console.log({ mizzy, eka });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
