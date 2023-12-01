import { getUser } from "@/lib/user";
import TeacherTeams from "@/components/manager-team-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import StudentTeams from "@/components/member-team-list";
import { Separator } from "@/components/ui/separator";
import Body from "@/components/body";
import AddTeam from "@/components/add-team";
import { createTeam, deleteTeam } from "@/lib/team";

export default async function Home() {
    // Get current user
    const user = await getUser();

    var teacherTeams = <></>;
    if (user?.role.name === "Teacher") {
        teacherTeams = (
            <>
                <div>
                    <h1 className="text-2xl">Add team</h1>
                    <AddTeam createTeam={createTeam} />
                </div>
                <div>
                    <h1 className="text-2xl mt-4">Owned Teams</h1>
                    <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                        <TeacherTeams deleteTeam={deleteTeam} />
                    </Suspense>
                </div>
            </>
        );
    }

    return (
        <Body
            title="Dashboard"
            description={
                <>
                    Welcome <b>{user?.username}</b> ({user?.role.name})
                </>
            }
        >
            <div className="space-y-8">
                {teacherTeams}
                <div>
                    <h1 className="text-2xl">Teams</h1>
                    <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                        <StudentTeams />
                    </Suspense>
                </div>
            </div>
        </Body>
    );
}
