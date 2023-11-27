"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

export default function AddTeam({ createTeam }: { createTeam: any }) {
    const { toast } = useToast();

    async function clientAction(formData: FormData) {
        var name: string = formData.get("name") as string;

        var error = await createTeam(name);

        if (error) {
            error = JSON.parse(error);
            toast({
                variant: "destructive",
                title: "Error" + " (" + error.issues[0].path + ")",
                description: error.issues[0].message,
                duration: 5000,
            });
        }

        // Clear the form
        var nameInput: any = document.querySelector('input[name="name"]');
        nameInput.value = "";
    }

    return (
        <form action={clientAction}>
            <div className="flex justify-between gap-5 mt-2">
                <Input name="name" placeholder="Team name" />
                <Button variant="default" type="submit">
                    Add
                </Button>
            </div>
        </form>
    );
}
