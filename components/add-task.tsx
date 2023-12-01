"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import React from "react";

export default function AddTask({
    addTask,
    teamId,
}: {
    addTask: any;
    teamId: number;
}) {
    const { toast } = useToast();
    const [date, setDate] = React.useState<Date>();
    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");

    async function clientAction(formData: FormData) {
        // Add teamId to formData
        formData.append("teamId", teamId.toString());

        // Append date to formData
        if (date) {
            formData.append("dueDate", date.toISOString());
        }

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

        setName("");
        setDescription("");
        setDate(undefined);
    }

    return (
        <form action={clientAction}>
            <div className="flex justify-between gap-5 mt-2">
                <Input
                    name="name"
                    placeholder="Task name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button variant="default" type="submit">
                    Add
                </Button>
            </div>
        </form>
    );
}
