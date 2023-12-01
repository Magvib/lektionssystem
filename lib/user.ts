// Get cookie from browser
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./db";
import bcrypt from "bcrypt";
import z from "zod";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    "use server";

    // Get (id, username, email, password, confirm-password) from formData and validate
    const schema = z.object({
        id: z.string(),
        username: z.string().min(3).max(30),
        email: z.string().email(),
    });

    try {
        schema.parse(Object.fromEntries(formData));
    } catch (error: any) {
        return JSON.stringify(error);
    }

    // Get user from database
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(formData.get("id") as string),
        },
    });

    // Check if user exists
    if (!user) {
        return JSON.stringify({
            issues: [
                {
                    path: "id",
                    message: "User does not exist",
                },
            ],
        });
    }

    // Check if username already exists except for the current user
    const username = formData.get("username") as string;
    const usernameExists = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (usernameExists && usernameExists.id !== user.id) {
        return JSON.stringify({
            issues: [
                {
                    path: "username",
                    message: "Username already exists",
                },
            ],
        });
    }

    // Check if email already exists except for the current user
    const email = formData.get("email") as string;
    const emailExists = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (emailExists && emailExists.id !== user.id) {
        return JSON.stringify({
            issues: [
                {
                    path: "email",
                    message: "Email already exists",
                },
            ],
        });
    }

    // Check if password and confirmPassword are equal except if both are empty
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate password if not empty
    if (password !== "" || confirmPassword !== "") {
        const passwordSchema = z.object({
            password: z.string().min(8),
            confirmPassword: z.string().min(8),
        });

        try {
            passwordSchema.parse(Object.fromEntries(formData));
        } catch (error: any) {
            return JSON.stringify(error);
        }
    }

    // Check if passwords match
    if (
        password !== confirmPassword &&
        password !== "" &&
        confirmPassword !== ""
    ) {
        return JSON.stringify({
            issues: [
                {
                    path: "password",
                    message: "Passwords do not match",
                },
            ],
        });
    }

    // Hash password if it exists
    let hashedPassword = "";

    if (password) {
        hashedPassword = bcrypt.hashSync(password, 10);
    }

    // Update user
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            username,
            email,
            password: (hashedPassword || user.password) as string,
        },
    });

    revalidatePath("/profile");
}

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
