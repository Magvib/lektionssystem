import { Button } from "@/components/ui/button";
import Link from "next/link";
import Members from "./members";
import Tasks from "./tasks";
import AddMember from "./addMember";
import { Team } from "@prisma/client";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import { Separator } from "@/components/ui/separator";
import AddTask from "./addTask";
import { addTaskHook } from "@/lib/task";
import Body from "@/components/body";
import { getTeam } from "@/lib/team";

export default async function Team({ params }: { params: { teamId: string } }) {
    const user = await getUser();
    const team = await getTeam(params.teamId);

    if (
        !team ||
        (!team.members.find((member) => member.id === user?.id) &&
            team.manager.id !== user?.id)
    ) {
        redirect("/");
    }

    return (
        <Body
            title={team?.name}
            description={
                <>
                    Creator: <b>{team?.manager.username}</b>
                </>
            }
            footer={
                <Link href="/">
                    <Button variant={"default"}>Home</Button>
                </Link>
            }
        >
            {user?.role.name === "Teacher" && (
                <>
                    <h1 className="text-2xl">Add member</h1>
                    <AddMember teamId={team?.id} />
                    <Separator orientation="horizontal" className="my-5" />
                </>
            )}

            <h1 className="text-2xl">Members</h1>
            <Members teamId={team?.id} members={team?.members || []} />
            {user?.role.name === "Teacher" && (
                <>
                    <h1 className="text-2xl">Add task</h1>
                    <AddTask addTask={addTaskHook} teamId={team?.id} />
                    <Separator orientation="horizontal" className="my-5" />
                </>
            )}
            <h1 className="text-2xl mt-5">Tasks</h1>
            <Tasks teamId={team?.id} tasks={team?.tasks || []} />
        </Body>
    );
}