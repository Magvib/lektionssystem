"use client";

import { Badge } from "./ui/badge";
import { TaskAssignment } from "@prisma/client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { set } from "date-fns";

export function UpdateTaskAssignment({
    taskAssignment,
    deleteTaskAssignment,
    teamId,
    taskId,
    allowRollback,
}: {
    taskAssignment: TaskAssignment;
    deleteTaskAssignment: any;
    teamId: string;
    taskId: string;
    allowRollback: boolean;
}) {
    // Make a last checked state
    const [lastChecked, setLastChecked] = useState(new Date());

    // Make a last checked string state
    const [lastCheckedString, setLastCheckedString] = useState("");

    // Make a pooling to check if the task has been graded
    useEffect(() => {
        const interval = setInterval(async () => {
            // Get grade fom current url and append /json to it
            const gradeUrl = window.location.href + "/json";

            // Fetch grade
            const taskAssignmentJson: TaskAssignment = await fetch(
                gradeUrl
            ).then((res) => res.json());

            // Set last checked
            setLastChecked(new Date());

            // If grade is not null then reload the page
            if (taskAssignmentJson.grade != taskAssignment.grade) {
                location.reload();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = now - lastChecked.getTime();
            const diffSeconds = Math.floor(diff / 1000);
            setLastCheckedString(
                diffSeconds < 0
                    ? "Just now"
                    : diffSeconds < 60
                    ? diffSeconds + " seconds ago"
                    : diffSeconds < 3600
                    ? Math.floor(diffSeconds / 60) + " minutes ago"
                    : diffSeconds < 86400
                    ? Math.floor(diffSeconds / 3600) + " hours ago"
                    : Math.floor(diffSeconds / 86400) + " days ago"
            );
        }, 100);

        return () => clearInterval(interval);
    }, [lastChecked]);

    return (
        <div>
            <p>Submission: {taskAssignment.submission}</p>
            <div>
                Grade:{" "}
                {taskAssignment.grade ? (
                    <Badge variant="default">{taskAssignment.grade}</Badge>
                ) : (
                    <Badge variant="secondary">Pending</Badge>
                )}
            </div>
            <div>
                Last checked:{" "}
                <span className="font-bold">{lastCheckedString}</span>
            </div>
            {allowRollback && !taskAssignment.grade && (
                <form action={deleteTaskAssignment}>
                    <input
                        type="hidden"
                        name="taskAssignment"
                        value={taskAssignment.id}
                    />
                    <input type="hidden" name="teamId" value={teamId} />
                    <input type="hidden" name="taskId" value={taskId} />
                    <Button
                        variant="destructive"
                        type="submit"
                        className="mt-4"
                    >
                        Rolback
                    </Button>
                </form>
            )}
        </div>
    );
}
