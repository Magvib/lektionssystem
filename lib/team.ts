import { revalidatePath } from "next/cache";
import prisma from "./db";
import { z } from "zod";
import { getUser } from "./user";

// Create a new team
export async function createTeam(name: string) {
    "use server";

    const user = await getUser();

    if (!user) {
        return null;
    }

    const teamSchema = z.object({
        name: z.string().min(3).max(50),
    });

    try {
        teamSchema.parse({
            name,
        });
    } catch (error: any) {
        return JSON.stringify(error);
    }

    const team = await prisma.team.create({
        data: {
            name,
            managerId: user.id,
        },
    });

    revalidatePath("/");
}

export async function deleteTeam(formData: FormData) {
    "use server";

    const user = await getUser();

    if (!user) {
        return null;
    }

    const teamId = formData.get("teamId");

    if (!teamId) {
        return null;
    }

    const team = await prisma.team.findUnique({
        where: {
            id: parseInt(teamId as string),
        },
    });

    if (!team) {
        return null;
    }

    if (team.managerId !== user.id) {
        return null;
    }

    await prisma.team.delete({
        where: {
            id: parseInt(teamId as string),
        },
    });

    revalidatePath("/");
}

export async function getTeam(teamId: string) {
    const team = await prisma.team.findUnique({
        where: {
            id: parseInt(teamId),
        },
        include: {
            manager: true,
            members: true,
            tasks: {
                orderBy: {
                    dueDate: "asc",
                },
            },
        },
    });

    if (!team) {
        return null;
    }

    return team;
}
