import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import Body from "@/components/body";
import { getTeam } from "@/lib/team";
import { getTask } from "@/lib/task";
import db from "@/lib/db";
import AddTaskAssignment from "@/components/add-task-assignment";

export default async function page({
    params,
}: {
    params: { teamId: string; taskId: string };
}) {
    const user = await getUser();
    const team = await getTeam(params.teamId);
    const task = await getTask(params.taskId);

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

    // Make a count of time left to hand in task
    var timeLeft = <span>No due date</span>;
    // Due date if null then just new Date()
    const dueDate = task.dueDate ? task.dueDate : new Date();

    // Calculate diff between now and due date
    const diff = dueDate.getTime() - new Date().getTime();

    // Calculate days, hours and minutes left
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    // Make color green if more than 24 hours left else yellow
    var color = days > 0 ? "text-green-600" : "text-yellow-600";

    // Format the time left
    timeLeft = (
        <span className={color}>
            {days}d {hours}h {minutes}m
        </span>
    );

    if (diff < 0) {
        timeLeft = <span className="text-red-600">Time is up</span>;
    }

    // Check if user has handed in the task
    const taskAssignment = await db.taskAssignment.findFirst({
        where: {
            taskId: task.id,
            userId: user?.id,
        },
    });

    async function createAssignment(formData: FormData) {
        "use server";
    }

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

            <h2 className="text-xl mt-4">Time left</h2>
            <span>{timeLeft}</span>

            <h2 className="text-xl mt-4">Assignment</h2>
            {taskAssignment ? (
                <div>
                    <p>Submission: {taskAssignment.submission}</p>
                    <p>Grade: {taskAssignment.grade}</p>
                </div>
            ) : (
                <div>
                    {(diff > 0 && (
                        <AddTaskAssignment
                            createAssignment={createAssignment}
                        />
                    )) || <p className="text-red-600">Not handed in</p>}
                </div>
            )}
        </Body>
    );
}
