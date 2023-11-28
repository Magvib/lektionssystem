"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

export default function AddTaskAssignment({
    createTaskAssignment,
    teamId,
    taskId,
}: {
    createTaskAssignment: any;
    teamId: string;
    taskId: string;
}) {
    const { toast } = useToast();

    async function clientAction(formData: FormData) {
        var error = await createTaskAssignment(formData);

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
        var nameInput: any = document.querySelector('input[name="submission"]');
        nameInput.value = "";
    }

    return (
        <form action={clientAction}>
            <div className="flex justify-between gap-5 mt-2">
                <input type="hidden" name="teamId" value={teamId} />
                <input type="hidden" name="taskId" value={taskId} />
                <Input
                    name="submission"
                    placeholder="Assignment description or link"
                />
                <Button variant="default" type="submit">
                    Upload
                </Button>
            </div>
        </form>
    );
}
