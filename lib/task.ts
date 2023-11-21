import { redirect } from "next/navigation";
import { getUser } from "./user";
import { z } from "zod";
import prisma from "./db";
import { revalidatePath } from "next/cache";

export async function addTaskHook(formData: FormData) {
    "use server";

    const name = formData.get("name");
    const description = formData.get("description");
    const teamId = parseInt(formData.get("teamId") as string);
    const user = await getUser();

    // Zod validation
    const taskSchema = z.object({
        name: z.string().min(3).max(255),
        description: z.string().min(5).max(255),
        teamId: z.number(),
    });

    // Validate form data
    try {
        taskSchema.parse({
            name: name as string,
            description: description as string,
            teamId: teamId,
        });
    } catch (error: any) {
        return JSON.stringify(error);
    }

    // Add task to team
    await prisma.task.create({
        data: {
            title: name as string,
            description: description as string,
            creatorId: user?.id as number,
            teamId: teamId,
        },
    });

    // Redirect to team page
    revalidatePath("/team/" + teamId);
}

export async function deleteTask(formData: FormData) {
    "use server";

    const taskId = parseInt(formData.get("taskId") as string);
    const teamId = parseInt(formData.get("teamId") as string);

    // Delete task
    await prisma.task.delete({
        where: {
            id: taskId,
        },
    });

    // Redirect to team page
    revalidatePath("/team/" + teamId);
}
