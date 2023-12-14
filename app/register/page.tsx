import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { z } from "zod";
import RegisterForm from "@/components/register-form";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

export default async function Register() {
    async function postRegister(formData: FormData) {
        "use server";

        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const password_confirm = formData.get("password_confirm");

        // Zod validation
        const schema = z.object({
            username: z.string().min(3),
            email: z.string().email(),
            password: z
                .string()
                .min(6)
                .refine(
                    (password) => {
                        return password === password_confirm;
                    },
                    {
                        message: "Passwords do not match",
                    }
                ),
        });

        // Validate data
        try {
            schema.parse({
                username: username as string,
                email: email as string,
                password: password as string,
            });
        } catch (error) {
            return JSON.stringify(error);
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                username: username as string,
                email: email as string,
                password: bcrypt.hashSync(password as string, 10),
                role: {
                    connect: {
                        name: "Student",
                    },
                },
            },
        });

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.PRIVATE_KEY as string,
            {
                expiresIn: "1d",
            }
        );

        // Login success
        cookies().set("user", token);
        redirect("/");
    }

    return <RegisterForm postRegister={postRegister} />;
}
