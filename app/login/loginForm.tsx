"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React from "react";

export default function LoginForm({ postLogin }: { postLogin: any }) {
    const { toast } = useToast();

    async function clientAction(formData: FormData) {
        var error = await postLogin(formData);

        if (error) {
            toast({
                variant: "destructive",
                title: error.message,
                duration: 5000,
            });

            // Clear password field and username field
            var passwordField: any = document.querySelector(
                'input[name="password"]',
            );
            var usernameField: any = document.querySelector(
                'input[name="username"]',
            );
            if (passwordField) {
                passwordField.value = "";
            }
            if (usernameField) {
                usernameField.value = "";
            }
        }
    }

    return (
        <form className="mx-auto w-2/3 pt-10" action={clientAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Student / Teacher</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="username">Username</Label>
                    <Input name="username" type="text" placeholder="Username" />
                    <br />
                    <Label htmlFor="password">Password</Label>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="submit">Login</Button>
                    <Link href="/register">
                        <Button type="submit" variant={"secondary"}>
                            Register
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </form>
    );
}
