import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const role1 = await prisma.role.create({
        data: {
            name: "Student",
        },
    });

    const role2 = await prisma.role.create({
        data: {
            name: "Teacher",
        },
    });

    const student1 = await prisma.user.create({
        data: {
            email: "student@student.local",
            password:
                "$2b$10$poFMW.h8jJkKwKdvB3nHquw4I5dGMsl3a1Efw7muy9TaDHj69Y3.K",
            username: "Student",
            role: {
                connect: {
                    id: role1.id,
                },
            },
        },
    });

    const student2 = await prisma.user.create({
        data: {
            email: "bob@student.local",
            password:
                "$2b$10$poFMW.h8jJkKwKdvB3nHquw4I5dGMsl3a1Efw7muy9TaDHj69Y3.K",
            username: "Bob",
            role: {
                connect: {
                    id: role1.id,
                },
            },
        },
    });

    const teacher1 = await prisma.user.create({
        data: {
            email: "teacher@teacher",
            password:
                "$2b$10$poFMW.h8jJkKwKdvB3nHquw4I5dGMsl3a1Efw7muy9TaDHj69Y3.K",
            username: "Teacher",
            role: {
                connect: {
                    id: role2.id,
                },
            },
        },
    });

    const teacher2 = await prisma.user.create({
        data: {
            email: "magnus@p13.dk",
            password:
                "$2b$10$poFMW.h8jJkKwKdvB3nHquw4I5dGMsl3a1Efw7muy9TaDHj69Y3.K",
            username: "Magvib",
            role: {
                connect: {
                    id: role2.id,
                },
            },
        },
    });

    console.log({ role1, role2, student1, student2, teacher1, teacher2 });
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
