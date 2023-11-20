import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import prisma from "@/lib/db";
import Link from "next/link";
import Members from "./members";
import Tasks from "./tasks";

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
            <div className='mx-auto w-2/3 pt-10'>
                <Card>
                    <CardHeader>
                        <CardTitle>{team?.name}</CardTitle>
                        <CardDescription>
                            Creator: <b>{team?.manager.username}</b>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className='text-red-600'>TODO: (add member, add task, hand in)</span>

                        <h1 className="text-2xl mt-5">Members</h1>
                        <Members members={team?.members || []} />
                        <h1 className="text-2xl mt-5">Tasks</h1>
                        <Tasks tasks={team?.tasks || []} />
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
