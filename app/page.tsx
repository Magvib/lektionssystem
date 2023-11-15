import { PrismaClient } from '@prisma/client'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUser, logout } from '@/lib/user'
import TeacherTeams from '@/components/teacherTeams'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import StudentTeams from '@/components/studentTeams'
import { Separator } from '@/components/ui/separator'

export default async function Home() {
    // Get current user
    const user = await getUser()
    
    var teacherTeams = <></>;
    if (user?.role.name === 'Teacher') {
        teacherTeams = (
            <div>
                <h1 className='text-2xl'>Owned Teams</h1>
                <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                <TeacherTeams />
                </Suspense>
                <Separator orientation="horizontal" className='my-5' />
            </div>
        )
    }

    return (
        <div>
            <div className='mx-auto w-1/2 pt-10'>
                <Card>
                    <CardHeader>
                        <CardTitle>Dashboard</CardTitle>
                        <CardDescription>
                            Welcome <b>{user?.username}</b> ({user?.role.name})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {teacherTeams}
                        <h1 className='text-2xl'>Teams</h1>
                        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                            <StudentTeams />
                        </Suspense>
                    </CardContent>
                    <CardFooter className='justify-start'>
                        <form action={logout}>
                            <Button variant={'destructive'}>Logout</Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
