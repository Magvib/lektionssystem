import { getUser } from "./user";
import { z } from "zod";
import prisma from "./db";
import { revalidatePath } from "next/cache";

// createTaskAssignment
export async function createTaskAssignment(formData: FormData) {
    "use server";

    const user = await getUser();
    const taskId = parseInt(formData.get("taskId") as string);
    const submission = formData.get("submission") as string;
    const teamId = parseInt(formData.get("teamId") as string);

    // Zod validation
    const taskAssignmentSchema = z.object({
        taskId: z.number(),
        submission: z.string().min(5).max(255),
        teamId: z.number(),
    });

    // Validate form data
    try {
        taskAssignmentSchema.parse({
            taskId: taskId,
            submission: submission,
            teamId: teamId,
        });
    } catch (error: any) {
        return JSON.stringify(error);
    }

    const task = await getTask(taskId.toString());

    // If task doesn't exist, return
    if (!task) {
        return {
            issues: [
                {
                    path: "taskId",
                    message: "Task doesn't exist",
                },
            ],
        };
    }

    // If task due date is passed, return
    if (task.dueDate && task.dueDate < new Date()) {
        return {
            issues: [
                {
                    path: "dueDate",
                    message: "Due date is passed",
                },
            ],
        };
    }

    // Add task assignment
    await prisma.taskAssignment.create({
        data: {
            taskId: taskId,
            userId: user?.id as number,
            submission: submission,
        },
    });

    // Redirect to team page
    revalidatePath("/team/" + teamId + "/task/" + taskId);
}

export async function getTask(taskId: string) {
    const task = await prisma.task.findUnique({
        where: {
            id: parseInt(taskId),
        },
        include: {
            creator: true,
            team: true,
        },
    });

    if (!task) {
        return null;
    }

    return task;
}

export async function createTask(formData: FormData) {
    "use server";

    const name = formData.get("name");
    const description = formData.get("description");
    const teamId = parseInt(formData.get("teamId") as string);
    const dueDate = formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string)
        : null;
    const user = await getUser();

    // Set timezone to UTC+2
    if (dueDate) {
        dueDate.setHours(dueDate.getHours() + 2);
    }

    // Zod validation
    const taskSchema = z.object({
        name: z.string().min(3).max(255),
        description: z.string().min(5).max(255),
        teamId: z.number(),
        dueDate: z.date().optional(),
    });

    // Validate form data
    try {
        taskSchema.parse({
            name: name as string,
            description: description as string,
            teamId: teamId,
            dueDate: dueDate,
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
            dueDate: dueDate,
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
