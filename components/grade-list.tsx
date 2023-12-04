import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getUser } from "@/lib/user";
import prisma from "@/lib/db";
import { Badge } from "./ui/badge";

export default async function GradeList() {
    // Get current user
    const user = await getUser();

    // Get all managed teams from the database
    const grades = await prisma.taskAssignment.findMany({
        where: {
            userId: user?.id,
        },
        include: {
            task: {
                include: {
                    team: {
                        include: {
                            manager: true,
                        },
                    },
                },
            },
        },
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Grade</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Manager</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {(grades.length !== 0 &&
                    grades.map((grade) => (
                        <TableRow key={grade.id}>
                            <TableCell className="font-medium">
                                {grade.grade ? (
                                    <Badge variant="default">
                                        {grade.grade}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">Pending</Badge>
                                )}
                            </TableCell>
                            <TableCell>{grade.submission}</TableCell>
                            <TableCell>{grade.task.title}</TableCell>
                            <TableCell>{grade.task.team.name}</TableCell>
                            <TableCell>
                                {grade.task.team.manager.username}
                            </TableCell>
                        </TableRow>
                    ))) || (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No grades found
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
