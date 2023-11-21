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

export default async function Tasks({
    tasks,
    teamId,
}: {
    tasks: Task[];
    teamId: number;
}) {
    const user = await getUser();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Desc</TableHead>
                    {/* If teacher show actions */}
                    {user?.role.name === "Teacher" && (
                        <TableHead>Actions</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.description}</TableCell>
                            {user?.role.name === "Teacher" && (
                                <TableCell>
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
                                </TableCell>
                            )}
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
