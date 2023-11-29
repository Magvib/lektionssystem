"use client";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import React from "react";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "@prisma/client";
import { useState } from "react";

export default function UpdateTask({
    teamId,
    task,
    updateTask,
}: {
    teamId: number;
    task: Task;
    updateTask: any;
}) {
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(
        task.dueDate || undefined
    );
    const [taskTitle, setTaskTitle] = useState<string>(task.title || "");
    const [taskDescription, setTaskDescription] = useState<string>(
        task.description || ""
    );

    async function clientAction(formData: FormData) {
        // Add teamId to formData
        formData.append("teamId", teamId.toString());
        formData.append("taskId", task.id.toString());

        // Append date to formData
        if (date) {
            formData.append("dueDate", date.toISOString());
        }

        var error = await updateTask(formData);

        if (error) {
            error = JSON.parse(error);
            toast({
                variant: "destructive",
                title: "Error" + " (" + error.issues[0].path + ")",
                description: error.issues[0].message,
                duration: 5000,
            });
        }
    }

    // Rollback changes
    function rollback() {
        setTaskTitle(task.title);
        setTaskDescription(task.description || "");
        setDate(task.dueDate || undefined);
    }

    // Make roolback button disabled if no changes were made
    const rollbackDisabled =
        task.title === taskTitle &&
        task.description === taskDescription &&
        task.dueDate === date;

    return (
        <form action={clientAction}>
            <div className="flex justify-between gap-5 mt-2">
                <Input
                    name="name"
                    placeholder="Task name"
                    value={taskTitle}
                    onChange={(e) => {
                        e.preventDefault();
                        setTaskTitle(e.target.value);
                    }}
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[400px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Due date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex justify-between gap-5 mt-2">
                <Input
                    name="description"
                    placeholder="Task description"
                    value={taskDescription}
                    onChange={(e) => {
                        e.preventDefault();
                        setTaskDescription(e.target.value);
                    }}
                />
                <Button variant="default" type="submit">
                    Update
                </Button>
                <Button
                    disabled={rollbackDisabled}
                    variant="destructive"
                    onClick={(e) => {
                        e.preventDefault();
                        rollback();
                    }}
                >
                    Rollback
                </Button>
            </div>
        </form>
    );
}
