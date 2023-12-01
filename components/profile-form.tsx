"use client";

import { useState } from "react";
import Body from "./body";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { useToast } from "./ui/use-toast";

export default function ProfileForm({
    user,
    userImage,
    updateProfile,
}: {
    user: any;
    updateProfile: any;
    userImage: string;
}) {
    const { toast } = useToast();
    const [username, setUsername] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function clientAction(formData: FormData) {
        var error = await updateProfile(formData);

        if (error) {
            error = JSON.parse(error);
            toast({
                variant: "destructive",
                title: "Error" + " (" + error.issues[0].path + ")",
                description: error.issues[0].message,
                duration: 5000,
            });
            return;
        }

        toast({
            variant: "default",
            title: "Success",
            description: "Your profile has been updated.",
            duration: 5000,
        });

        // Set password fields to blank
        setPassword("");
        setConfirmPassword("");
    }

    // Function to roolback changes
    function rollback() {
        setUsername(user?.username ?? "");
        setEmail(user?.email ?? "");
        setPassword("");
        setConfirmPassword("");
    }

    // Cancel button disabled if no changes have been made
    const cancelDisabled =
        username === user?.username &&
        email === user?.email &&
        password === "" &&
        confirmPassword === "";

    return (
        <Body title="Profile">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-muted-foreground">
                        This is how others will see you on the site.
                    </p>
                </div>
                <Separator />
                <form className="space-y-8" action={clientAction}>
                    <input type="hidden" name="id" value={user?.id ?? ""} />
                    <div className="flex items-center space-x-4 bg-neutral-800 p-4 rounded-lg">
                        <Image
                            src={userImage}
                            width={32}
                            height={32}
                            alt={user?.username ?? ""}
                            className="rounded-full"
                        />
                        <span>
                            <b>{user?.username}</b> ({user?.role.name})
                            <br />
                            <b>Email:</b> {user?.email}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Username
                        </label>
                        <Input
                            name="username"
                            value={username ?? ""}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            This is your public display name. It can be your
                            real name or a pseudonym.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Email
                        </label>
                        <Input
                            name="email"
                            value={email ?? ""}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground">
                            You can change your email address at any time.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Password
                        </label>
                        <Input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground text-red-600">
                            Enter a new password if you want to change your
                            current one. Leave blank to keep your current
                            password.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Confirm Password
                        </label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <p className="text-[0.8rem] text-muted-foreground text-red-600">
                            Confirm your new password. Leave blank if you do not
                            want to change your password.
                        </p>
                    </div>
                    <div className="flex justify-end gap-4">
                        {/* Rolback btn */}
                        <Button
                            disabled={cancelDisabled}
                            variant="destructive"
                            onClick={() => rollback()}
                        >
                            Cancel
                        </Button>
                        <Button variant="default">Update</Button>
                    </div>
                </form>
            </div>
        </Body>
    );
}
