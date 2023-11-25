"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import Body from "@/components/body";

export default function RegisterForm({ postRegister }: { postRegister: any }) {
    const { toast } = useToast();

    async function clientAction(formData: FormData) {
        var error = await postRegister(formData);
        error = JSON.parse(error);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error" + " (" + error.issues[0].path + ")",
                description: error.issues[0].message,
                duration: 5000,
            });
        }
    }

    return (
        <form action={clientAction}>
            <Body
                title="Register"
                description="Student"
                footer={
                    <div className="flex justify-between w-full">
                        <Button type="submit">Register</Button>
                        <Link href="/login">
                            <Button type="submit" variant={"secondary"}>
                                Login
                            </Button>
                        </Link>
                    </div>
                }
            >
                <Label htmlFor="username">Username</Label>
                <Input name="username" type="text" placeholder="Username" />
                <br />
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="text" placeholder="Email" />
                <br />
                <Label htmlFor="password">Password</Label>
                <Input name="password" type="password" placeholder="Password" />
                <br />
                <Label htmlFor="password_confirm">Password confirm</Label>
                <Input
                    name="password_confirm"
                    type="password"
                    placeholder="Password confirm"
                />
            </Body>
        </form>
    );
}
