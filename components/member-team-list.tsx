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

export default async function StudentTeams() {
    // Get current user
    const user = await getUser();

    // Get all managed teams from the database
    const teams = await prisma.team.findMany({
        where: {
            members: {
                some: {
                    id: user?.id,
                },
            },
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
                                    <Button variant={"default"}>View</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))) || (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            You are not a member of any team
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
