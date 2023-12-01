import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getUser } from "@/lib/user";
import prisma from "@/lib/db";

export default async function TeacherTeams({
    deleteTeam,
}: {
    deleteTeam: any;
}) {
    // Get current user
    const user = await getUser();

    // Await for 10 seconds just for testing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get all managed teams from the database
    const teams = await prisma.team.findMany({
        where: {
            managerId: user?.id,
        },
        include: {
            manager: true,
            members: true,
            tasks: true,
        },
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {(teams.length !== 0 &&
                    teams.map((team) => (
                        <TableRow key={team.id}>
                            <TableCell className="font-medium">
                                {team.name}
                            </TableCell>
                            <TableCell>{team.manager.username}</TableCell>
                            <TableCell>{team.members.length}</TableCell>
                            <TableCell>{team.tasks.length}</TableCell>
                            <TableCell className="flex gap-4 justify-end">
                                <Link href={`/team/${team.id}`}>
                                    <Button variant={"secondary"}>Edit</Button>
                                </Link>
                                <form action={deleteTeam}>
                                    <input
                                        type="hidden"
                                        name="teamId"
                                        value={team.id}
                                    />
                                    <Button variant={"destructive"}>
                                        Delete
                                    </Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))) || (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No teams found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
