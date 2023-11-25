import { getUser } from "@/lib/user";
import TeacherTeams from "@/components/manager-team-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import StudentTeams from "@/components/member-team-list";
import { Separator } from "@/components/ui/separator";
import Body from "@/components/body";

export default async function Home() {
    // Get current user
    const user = await getUser();

    var teacherTeams = <></>;
    if (user?.role.name === "Teacher") {
        teacherTeams = (
            <div>
                <h1 className="text-2xl">Owned Teams</h1>
                <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                    <TeacherTeams />
                </Suspense>
                <Separator orientation="horizontal" className="my-5" />
            </div>
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
            {teacherTeams}
            <h1 className="text-2xl">Teams</h1>
            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                <StudentTeams />
            </Suspense>
        </Body>
    );
}
