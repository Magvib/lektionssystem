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
        },
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Users count</TableHead>
                    <TableHead className="text-end">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {teams.map((team) => (
                    <TableRow key={team.id}>
                        <TableCell className="font-medium">
                            {team.name}
                        </TableCell>
                        <TableCell>{team.manager.username}</TableCell>
                        <TableCell>{team.members.length}</TableCell>
                        <TableCell className="flex gap-4 justify-end">
                            <Link href={`/team/${team.id}`}>
                                <Button variant={"default"}>View</Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
