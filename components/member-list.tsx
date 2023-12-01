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

export default async function MemberList({
    members,
    teamId,
    isManager,
}: {
    members: User[];
    teamId: number;
    isManager: boolean;
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
                    {isManager && <TableHead>Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.length > 0 ? (
                    members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.username}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            {isManager && (
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
                        <TableCell colSpan={3} className="text-center">
                            No members
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
