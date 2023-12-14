import { getAvatar, getUser, logout } from "@/lib/user";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default async function Nav() {
    const user = await getUser(true);
    const isTeacher = user?.role.name === "Teacher";

    if (!user) {
        return (
            <div className="container mx-auto pt-10">
                <Card>
                    <Skeleton className="w-auto h-16" />
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-10">
            <Card className="flex items-center justify-between space-x-4 lg:space-x-6 h-16 px-4">
                <Link href="/profile">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={await getAvatar()}
                            width={32}
                            height={32}
                            alt={user?.username ?? ""}
                            className="rounded-full"
                        />
                        <span>
                            <b>{user.username}</b> ({user.role.name})
                        </span>
                    </div>
                </Link>
                <div className="flex items-center space-x-4">
                    <Link href="/">Dashboard</Link>
                    {isTeacher ? (
                        <Link href="/admin">
                            <Button variant={"secondary"}>Admin</Button>
                        </Link>
                    ) : (
                        <Link href="/grades">
                            <Button variant={"secondary"}>Grades</Button>
                        </Link>
                    )}
                    <form action={logout}>
                        <Button variant={"destructive"}>Logout</Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
