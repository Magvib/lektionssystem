import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import Body from "@/components/body";
import { getTeam } from "@/lib/team";
import {
    createTaskAssignment,
    deleteTaskAssignment,
    getTask,
    updateTask,
} from "@/lib/task";
import db from "@/lib/db";
import AddTaskAssignment from "@/components/add-task-assignment";
import { Badge } from "@/components/ui/badge";
import TimeLeft from "@/components/time-left";
import UpdateTask from "@/components/update-task";
import AssignmentList from "@/components/assignment-list";
import { format } from "date-fns";

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
            <div className="space-y-8">
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
                            {format(dueDate, "PPP")}
                        </span>
                    </div>
                </div>

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

                {(isManager && (
                    <div>
                        <h2 className="text-xl mt-4">Assignment list</h2>
                        <AssignmentList
                            taskAssignments={taskAssignments}
                            team={team}
                            task={task}
                        />
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
                                        createTaskAssignment={
                                            createTaskAssignment
                                        }
                                        teamId={team?.id.toString()}
                                        taskId={task?.id.toString()}
                                    />
                                )) || (
                                    <p className="text-red-600">
                                        Not handed in
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Body>
    );
}
