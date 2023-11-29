import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Input } from "./ui/input";
import { z } from "zod";

export default async function UpdateTeam({ teamId }: { teamId: number }) {
    async function renameTeam(formData: FormData) {
        "use server";

        const teamId = formData.get("taskId");
        const teamName = formData.get("name");

        // Zod validation for name
        const schema = z.object({
            name: z.string().min(3).max(50),
        });

        // Validate form data
        try {
            schema.parse({
                name: teamName,
            });
        } catch (err) {
            return JSON.stringify(err);
        }

        // Update team name
        await prisma.team.update({
            where: {
                id: parseInt(teamId as string),
            },
            data: {
                name: teamName as string,
            },
        });

        // Clear input
        formData.set("name", "");

        // Redirect to team page
        revalidatePath("/team/" + teamId);
    }

    return (
        <form action={renameTeam}>
            <div className="flex justify-between gap-5 mt-2">
                <input type="hidden" name="taskId" value={teamId} />
                <Input name="name" placeholder="New task name" />
                <Button variant="default" type="submit">
                    Update
                </Button>
            </div>
        </form>
    );
}
