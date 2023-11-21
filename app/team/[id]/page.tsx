import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import Link from "next/link";
import Members from "./members";
import Tasks from "./tasks";
import AddMember from "./addMember";
import { Team } from "@prisma/client";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import { Separator } from "@/components/ui/separator";

export default async function Team({ params }: { params: { id: string } }) {
    const user = await getUser();
    const team = await prisma.team.findUnique({
        where: {
            id: parseInt(params.id),
        },
        include: {
            manager: true,
            members: true,
            tasks: true,
        },
    });

    // Return 404 if team doesn't exist
    if (!team) {
        redirect("/");
    }

    // Redirect if user is not a member of the team or is the manager
    if (
        !team.members.find((member) => member.id === user?.id) &&
        team.manager.id !== user?.id
    ) {
        redirect("/");
    }

    return (
        <div>
            <div className="mx-auto w-2/3 pt-10">
                <Card>
                    <CardHeader>
                        <CardTitle>{team?.name}</CardTitle>
                        <CardDescription>
                            Creator: <b>{team?.manager.username}</b>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user?.role.name === "Teacher" && (
                            <>
                                <h1 className="text-2xl">Add member</h1>
                                <AddMember teamId={team?.id} />
                                <Separator
                                    orientation="horizontal"
                                    className="my-5"
                                />
                            </>
                        )}

                        <h1 className="text-2xl">Members</h1>
                        <Members
                            teamId={team?.id}
                            members={team?.members || []}
                        />
                        <h1 className="text-2xl mt-5">Tasks</h1>
                        <Tasks tasks={team?.tasks || []} />
                    </CardContent>
                    <CardFooter className="justify-start">
                        <Link href="/">
                            <Button variant={"default"}>Home</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
