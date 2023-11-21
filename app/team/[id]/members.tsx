import { User } from "@prisma/client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/user";

export default async function Members({
    members,
    teamId,
}: {
    members: User[];
    teamId: number;
}) {
    async function removeMember(formData: FormData) {
        "use server";

        const userId = formData.get("userId");

        if (userId === undefined || userId === null) {
            return;
        }

        // Remove member from team
        await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                members: {
                    disconnect: {
                        id: parseInt(userId as string),
                    },
                },
            },
        });

        // Remove all tasks from user
        await prisma.taskAssignment.deleteMany({
            where: {
                userId: parseInt(userId as string),
                task: {
                    teamId: teamId,
                },
            },
        });

        // Redirect to team page
        revalidatePath("/team/" + teamId);
    }

    const user = await getUser();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    {user?.role.name === "Teacher" && (
                        <TableHead>Actions</TableHead>
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.length > 0 ? (
                    members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.username}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            {user?.role.name === "Teacher" && (
                                <TableCell>
                                    <form action={removeMember}>
                                        <input
                                            type="hidden"
                                            name="userId"
                                            value={member.id}
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
