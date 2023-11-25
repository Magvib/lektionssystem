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

export default async function TaskList({
    tasks,
    teamId,
}: {
    tasks: Task[];
    teamId: number;
}) {
    const user = await getUser();
    const team = await getTeam(teamId.toString());

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Desc</TableHead>
                    <TableHead>Due Date</TableHead>
                    {user?.id !== team?.managerId && (
                        <TableHead>Status</TableHead>
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
                                // TODO: Show status of the task for the user
                                <TableCell>Not sent</TableCell>
                            )}
                            <TableCell>
                                {(user?.id === team?.managerId && (
                                    <div className="flex gap-4 justify-end">
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
