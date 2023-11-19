import { User } from "@prisma/client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function Members({ members }: { members: User[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.length > 0 ? (
                    members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.username}</TableCell>
                            <TableCell>{member.email}</TableCell>
                        </TableRow>
                    ))
                ) : (
                <TableRow>
                    <TableCell>
                        No results.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
