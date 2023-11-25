import prisma from "./db";

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
