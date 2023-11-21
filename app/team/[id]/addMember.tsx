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

export default async function AddMember({ teamId }: { teamId: number }) {
    async function addMember(formData: FormData) {
        "use server";

        const userId = formData.get("userId");

        // Add member to team
        await prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                members: {
                    connect: {
                        id: parseInt(userId as string),
                    },
                },
            },
        });

        // Redirect to team page
        revalidatePath("/team/" + teamId);
    }

    const team = await prisma.team.findUnique({
        where: {
            id: teamId,
        },
        include: {
            manager: true,
            members: true,
            tasks: true,
        },
    });

    // Get all users from db
    var users = await prisma.user.findMany({
        include: {
            role: true,
        },
    });

    // Filter out users that are already in the team
    users = users.filter((user) => {
        return !team?.members.find((member: any) => member.id === user.id);
    });

    // Filter out the manager
    users = users.filter((user) => {
        return user.id !== team?.manager.id;
    });

    // Return nothing if there are no users to add
    if (users.length === 0) {
        return (
            <div className="text-center">
                <span className="text-gray-500">No users to add</span>
            </div>
        );
    }

    return (
        <form action={addMember}>
            <div className="flex justify-between gap-5 mt-2">
                <Select name="userId">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Members</SelectLabel>
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
                <Button variant="default" type="submit">
                    Add
                </Button>
            </div>
        </form>
    );
}
