import db from "@/lib/db";
import { getUser } from "@/lib/user";

export async function GET(
    request: Request,
    { params }: { params: { teamId: string; taskId: string } }
) {
    const user = await getUser();
    // TaskAssignment from database by id
    const taskAssignment = await db.taskAssignment.findFirst({
        where: {
            taskId: parseInt(params.taskId),
            userId: user?.id,
        },
    });

    return new Response(JSON.stringify(taskAssignment), {
        headers: { "content-type": "application/json" },
    });
}
