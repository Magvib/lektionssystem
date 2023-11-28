import { Task } from "@prisma/client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getUser } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { deleteTask } from "@/lib/task";
import { format } from "date-fns";
import Link from "next/link";
import { getTeam } from "@/lib/team";
import db from "@/lib/db";
import { Badge } from "./ui/badge";

export default async function TaskList({
    tasks,
    teamId,
}: {
    tasks: Task[];
    teamId: number;
}) {
    const user = await getUser();
    const team = await getTeam(teamId.toString());

    // Get all taskAssignments for this user and this team
    const taskAssignments = await db.taskAssignment.findMany({
        where: {
            userId: user?.id,
            taskId: {
                in: tasks.map((task) => task.id),
            },
        },
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Desc</TableHead>
                    <TableHead>Due Date</TableHead>
                    {user?.id !== team?.managerId && (
                        <TableHead>Grade</TableHead>
                    )}
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.description}</TableCell>
                            <TableCell>
                                {task.dueDate
                                    ? format(task.dueDate, "PPP")
                                    : ""}
                            </TableCell>
                            {user?.id !== team?.managerId && (
                                <TableCell>
                                    {(() => {
                                        const taskAssignment =
                                            taskAssignments.find(
                                                (taskAssignment) =>
                                                    taskAssignment.taskId ===
                                                    task.id
                                            );

                                        if (!taskAssignment) {
                                            return (
                                                <Badge variant="outline">
                                                    Not graded
                                                </Badge>
                                            );
                                        }

                                        if (taskAssignment.grade !== null) {
                                            return (
                                                <Badge variant="default">
                                                    {taskAssignment.grade}
                                                </Badge>
                                            );
                                        }

                                        return (
                                            <Badge variant="secondary">
                                                Pending
                                            </Badge>
                                        );
                                    })()}
                                </TableCell>
                            )}
                            <TableCell>
                                {(user?.id === team?.managerId && (
                                    <div className="flex gap-4">
                                        <Link
                                            href={`/team/${teamId}/task/${task.id}`}
                                        >
                                            <Button variant="secondary">
                                                Edit
                                            </Button>
                                        </Link>
                                        <form action={deleteTask}>
                                            <input
                                                type="hidden"
                                                name="taskId"
                                                value={task.id}
                                            />
                                            <input
                                                type="hidden"
                                                name="teamId"
                                                value={teamId}
                                            />
                                            <Button variant="destructive">
                                                Remove
                                            </Button>
                                        </form>
                                    </div>
                                )) || (
                                    <Link
                                        href={`/team/${teamId}/task/${task.id}`}
                                    >
                                        <Button variant="default">View</Button>
                                    </Link>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell>No results.</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
