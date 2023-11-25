import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import Body from "@/components/body";
import { getTeam } from "@/lib/team";
import { getTask } from "@/lib/task";

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

    if (!task) {
        redirect(`/team/${team?.id}`);
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
        </Body>
    );
}
