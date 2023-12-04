import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function RemoveTeacher() {
    async function removeTeacher(formData: FormData) {
        "use server";

        const userId = formData.get("userId");

        // Change user to teacher
        await prisma.user.update({
            where: {
                id: parseInt(userId as string),
            },
            data: {
                role: {
                    connect: {
                        name: "Student",
                    },
                },
            },
        });

        // Redirect to team page
        revalidatePath("/");
    }

    // Get all users from db
    var users = await prisma.user.findMany({
        include: {
            role: true,
        },
        where: {
            role: {
                name: "Teacher",
            },
        },
    });

    // Return nothing if there are no users to add
    if (users.length === 0) {
        return (
            <div className="text-center">
                <span className="text-gray-500">No users to remove</span>
            </div>
        );
    }

    return (
        <form action={removeTeacher}>
            <div className="flex justify-between gap-5 mt-2">
                <Select name="userId">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a teacher to demote" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Teachers</SelectLabel>
                            {users.map((users) => {
                                return (
                                    <SelectItem
                                        key={users.id}
                                        value={users.id + ""}
                                    >
                                        {users.username} ({users.role.name})
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button variant="destructive" type="submit">
                    Demote
                </Button>
            </div>
        </form>
    );
}
