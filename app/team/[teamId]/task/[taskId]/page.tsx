import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import Body from "@/components/body";
import { getTeam } from "@/lib/team";
import {
    changeTaskAssignment,
    createTaskAssignment,
    deleteTaskAssignment,
    getTask,
    updateTask,
} from "@/lib/task";
import db from "@/lib/db";
import AddTaskAssignment from "@/components/add-task-assignment";
import { Badge } from "@/components/ui/badge";
import TimeLeft from "@/components/time-left";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UpdateTask from "@/components/update-task";

export default async function page({
    params,
}: {
    params: { teamId: string; taskId: string };
}) {
    const user = await getUser();
    const team = await getTeam(params.teamId);
    const task = await getTask(params.taskId);
    const isManager = team?.manager.id === user?.id;

    if (
        !team ||
        (!team.members.find((member) => member.id === user?.id) &&
            team.manager.id !== user?.id)
    ) {
        redirect("/");
    }

    if (!task || !team.tasks.find((t) => t.id === task.id)) {
        redirect(`/team/${team?.id}`);
    }

    // Due date if null then just new Date()
    const dueDate = task.dueDate ? task.dueDate : new Date();

    // Calculate diff between now and due date
    const diff = dueDate.getTime() - new Date().getTime();

    // Check if user has handed in the task
    const taskAssignment = await db.taskAssignment.findFirst({
        where: {
            taskId: task.id,
            userId: user?.id,
        },
    });

    const taskAssignments = await db.taskAssignment.findMany({
        where: {
            taskId: task.id,
        },
        include: {
            user: true,
        },
    });

    return (
        <Body
            title={team?.name + " - " + task?.title}
            description={
                <>
                    Creator: <b>{team?.manager.username}</b>
                </>
            }
            footer={
                <Link href={`/team/${team?.id}`}>
                    <Button variant={"secondary"}>Back</Button>
                </Link>
            }
        >
            <h1 className="text-2xl">{task?.title}</h1>
            <p>{task?.description}</p>

            {isManager && (
                <div>
                    <h2 className="text-xl mt-4">Update task</h2>
                    <UpdateTask
                        teamId={team?.id}
                        task={task}
                        updateTask={updateTask}
                    />
                </div>
            )}
            <h2 className="text-xl mt-4">Time left</h2>
            <span>
                <TimeLeft dueDate={task.dueDate} />
            </span>

            {(isManager && (
                <div>
                    <h2 className="text-xl mt-4">Assignment list</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Submission</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {taskAssignments.length > 0 ? (
                                taskAssignments.map((taskAssignment) => (
                                    <TableRow key={taskAssignment.id}>
                                        <TableCell>
                                            {taskAssignment.user.username}
                                        </TableCell>
                                        <TableCell>
                                            {taskAssignment.submission}
                                        </TableCell>
                                        <TableCell>
                                            {taskAssignment.grade ? (
                                                <Badge variant="default">
                                                    {taskAssignment.grade}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Awaiting grade
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <form
                                                className="flex flex-row gap-4"
                                                action={changeTaskAssignment}
                                            >
                                                <input
                                                    type="hidden"
                                                    name="taskAssignment"
                                                    value={taskAssignment.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="teamId"
                                                    value={team?.id}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="taskId"
                                                    value={task?.id}
                                                />
                                                <Select name="grade">
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a grade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Grades
                                                            </SelectLabel>
                                                            <SelectItem value="delete">
                                                                Delete
                                                            </SelectItem>
                                                            <SelectItem value="pending">
                                                                Pending
                                                            </SelectItem>
                                                            <SelectItem value="-3">
                                                                -3
                                                            </SelectItem>
                                                            <SelectItem value="00">
                                                                00
                                                            </SelectItem>
                                                            <SelectItem value="02">
                                                                02
                                                            </SelectItem>
                                                            <SelectItem value="4">
                                                                4
                                                            </SelectItem>
                                                            <SelectItem value="7">
                                                                7
                                                            </SelectItem>
                                                            <SelectItem value="10">
                                                                10
                                                            </SelectItem>
                                                            <SelectItem value="12">
                                                                12
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="default"
                                                    type="submit"
                                                >
                                                    Apply Grade
                                                </Button>
                                            </form>
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
                </div>
            )) || (
                <div>
                    <h2 className="text-xl mt-4">Assignment</h2>
                    {taskAssignment ? (
                        <div>
                            <p>Submission: {taskAssignment.submission}</p>
                            <div>
                                Grade:{" "}
                                {taskAssignment.grade ? (
                                    <Badge variant="default">
                                        {taskAssignment.grade}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        Awaiting grade
                                    </Badge>
                                )}
                            </div>
                            {diff > 0 && !taskAssignment.grade && (
                                <form action={deleteTaskAssignment}>
                                    <input
                                        type="hidden"
                                        name="taskAssignment"
                                        value={taskAssignment.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="teamId"
                                        value={team?.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="taskId"
                                        value={task?.id}
                                    />
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
                    ) : (
                        <div>
                            {(diff > 0 && (
                                <AddTaskAssignment
                                    createTaskAssignment={createTaskAssignment}
                                    teamId={team?.id.toString()}
                                    taskId={task?.id.toString()}
                                />
                            )) || <p className="text-red-600">Not handed in</p>}
                        </div>
                    )}
                </div>
            )}
        </Body>
    );
}
