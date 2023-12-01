import MemberList from "@/components/member-list";
import TaskList from "../../../components/task-list";
import AddMember from "@/components/add-member";
import { Team } from "@prisma/client";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import { Separator } from "@/components/ui/separator";
import AddTask from "@/components/add-task";
import { createTask } from "@/lib/task";
import Body from "@/components/body";
import { getTeam } from "@/lib/team";
import UpdateTeam from "@/components/update-team";

export default async function Team({ params }: { params: { teamId: string } }) {
    const user = await getUser();
    const team = await getTeam(params.teamId);
    const isManager = team?.manager.id === user?.id;

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
        >
            <div className="space-y-8">
                {isManager && (
                    <>
                        <div>
                            <h1 className="text-2xl">Rename team</h1>
                            <UpdateTeam teamId={team?.id} />
                        </div>
                        <div>
                            <h1 className="text-2xl mt-4">Add member</h1>
                            <AddMember teamId={team?.id} />
                        </div>
                    </>
                )}

                <div>
                    <h1 className="text-2xl">Members</h1>
                    <MemberList
                        teamId={team?.id}
                        members={team?.members || []}
                        isManager={isManager}
                    />
                </div>
                {isManager && (
                    <div>
                        <h1 className="text-2xl">Add task</h1>
                        <AddTask addTask={createTask} teamId={team?.id} />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl mt-5">Tasks</h1>
                    <TaskList teamId={team?.id} tasks={team?.tasks || []} />
                </div>
            </div>
        </Body>
    );
}
