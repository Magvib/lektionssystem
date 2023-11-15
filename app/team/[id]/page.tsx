import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function Team({ params }: { params: { id: string } }) {
    const team = await prisma.team.findUnique({
        where: {
            id: parseInt(params.id)
        },
        include: {
            manager: true,
            members: true,
            tasks: true
        }
    })

    return (
        <div>
            <div className='mx-auto w-1/2 pt-10'>
                <Card>
                    <CardHeader>
                        <CardTitle>{team?.name}</CardTitle>
                        <CardDescription>
                            Creator: <b>{team?.manager.username}</b>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        Members: {team?.members.map((member) => (
                            <div key={member.id}>
                                {member.username}
                            </div>
                        ))}
                        <br />
                        Tasks: {team?.tasks.map((task) => (
                            <div key={task.id}>
                                {task.title}: {task.description}
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className='justify-start'>
                        <Link href="/">
                            <Button variant={'default'}>Home</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
