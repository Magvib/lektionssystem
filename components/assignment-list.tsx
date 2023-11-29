import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { changeTaskAssignment } from "@/lib/task";
import { Badge } from "./ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

export default function AssignmentList({
    taskAssignments,
    team,
    task,
}: {
    taskAssignments: any[];
    team: any;
    task: any;
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {taskAssignments.length > 0 ? (
                    taskAssignments.map((taskAssignment) => (
                        <TableRow key={taskAssignment.id}>
                            <TableCell>
                                {taskAssignment.user.username}
                            </TableCell>
                            <TableCell>{taskAssignment.submission}</TableCell>
                            <TableCell>
                                {taskAssignment.grade ? (
                                    <Badge variant="default">
                                        {taskAssignment.grade}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        Awaiting grade
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <form
                                    className="flex flex-row gap-4"
                                    action={changeTaskAssignment}
                                >
                                    <input
                                        type="hidden"
                                        name="taskAssignment"
                                        value={taskAssignment.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="teamId"
                                        value={team?.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="taskId"
                                        value={task?.id}
                                    />
                                    <Select name="grade">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Grades
                                                </SelectLabel>
                                                <SelectItem value="delete">
                                                    Delete
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="-3">
                                                    -3
                                                </SelectItem>
                                                <SelectItem value="00">
                                                    00
                                                </SelectItem>
                                                <SelectItem value="02">
                                                    02
                                                </SelectItem>
                                                <SelectItem value="4">
                                                    4
                                                </SelectItem>
                                                <SelectItem value="7">
                                                    7
                                                </SelectItem>
                                                <SelectItem value="10">
                                                    10
                                                </SelectItem>
                                                <SelectItem value="12">
                                                    12
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="default" type="submit">
                                        Apply Grade
                                    </Button>
                                </form>
                            </TableCell>
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
