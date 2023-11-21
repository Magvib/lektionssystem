"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function AddTask({
    addTask,
    teamId,
}: {
    addTask: any;
    teamId: number;
}) {
    const { toast } = useToast();

    async function clientAction(formData: FormData) {
        // Add teamId to formData
        formData.append("teamId", teamId.toString());

        var error = await addTask(formData);

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
        var name: any = document.querySelector('input[name="name"]');
        var description: any = document.querySelector(
            'input[name="description"]'
        );

        name.value = "";
        description.value = "";
    }

    return (
        <form action={clientAction}>
            <div className="flex justify-between gap-5 mt-2">
                <Input name="name" placeholder="Task name" />
                <Input name="description" placeholder="Task description" />
                <Button variant="default" type="submit">
                    Add
                </Button>
            </div>
        </form>
    );
}
