import { getAvatar, getUser, logout } from "@/lib/user";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image";



export default async function Nav() {
    const user = await getUser();

    if (!user) {
        return (
            <div className='mx-auto w-2/3 pt-10'>
                <Card>
                    <Skeleton className="w-auto h-16" />
                </Card>
            </div>
        )
    }

    return (
        <div className='mx-auto w-2/3 pt-10'>
            <Card className="flex items-center justify-between space-x-4 lg:space-x-6 h-16 px-4">
                <div className="flex items-center space-x-2">
                    <Image src={await getAvatar()} width={32} height={32} alt="" className="rounded-full" />
                    <b>{user.username}</b> ({user.role.name})
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/">Dashboard</Link>
                    <form action={logout}>
                        <Button variant={'destructive'}>Logout</Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}
