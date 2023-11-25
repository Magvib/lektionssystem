// Get cookie from browser
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./db";
import bcrypt from "bcrypt";

export async function checkCredentials(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
        include: {
            role: true,
            managedTeams: {
                include: {
                    members: true,
                    manager: true,
                    tasks: true,
                },
            },
        },
    });

    // Check if user exists
    if (!user) {
        return false;
    }

    // Check if password is correct with bcrypt.compareSync
    if (user && bcrypt.compareSync(password, user.password || "")) {
        return user.id;
    }

    return false;
}

export async function getUser() {
    const user = cookies().get("user");

    if (user) {
        const userId = parseInt(user.value, 10);

        if (!isNaN(userId)) {
            return await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    role: true,
                    managedTeams: {
                        include: {
                            members: true,
                            manager: true,
                            tasks: true,
                        },
                    },
                },
            });
        }
    }

    return null;
}

export async function getAvatar() {
    const user = await getUser();

    if (user?.username) {
        // Parse username and check for a-zA-Z0-9
        const username = user.username.replace(/[^a-zA-Z0-9]/g, "");
        return `https://www.gravatar.com/avatar/${username}?s=128&d=identicon&r=PG`;
    }

    return "https://www.gravatar.com/avatar/1?s=128&d=identicon&r=PG";
}

export async function logout() {
    "use server";
    cookies().delete("user");
    redirect("/login");
}
