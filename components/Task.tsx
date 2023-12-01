import { Task } from "@prisma/client";
import { format } from "date-fns";
import React from "react";
import TimeLeft from "./time-left";

export function Task({ task }: { task: Task }) {
    return (
        <div className="p-5 bg-secondary rounded shadow-md">
            <h1 className="text-xl text-gray-200">{task?.title}</h1>
            <p className="text-gray-400">{task?.description}</p>
            <div className="mt-5">
                <h2 className="text-xl text-gray-200">Time left</h2>
                <span className="text-lg text-gray-500">
                    <TimeLeft dueDate={task.dueDate} />
                </span>
            </div>
            <div className="mt-5">
                <h1 className="text-xl">Due date</h1>
                <span className="text-gray-200">
                    {format(task.dueDate ?? new Date(), "PPP")}
                </span>
            </div>
        </div>
    );
}
