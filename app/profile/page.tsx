import Body from "@/components/body";
import { getUser, getAvatar } from "@/lib/user";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function page() {
    const user = await getUser();

    // TODO: Make server action to update user profile

    return (
        <Body title="Profile">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-muted-foreground">
                        This is how others will see you on the site.
                    </p>
                </div>
                <Separator />
                <form className="space-y-8">
                    {/* Make it a card */}
                    <div className="flex items-center space-x-4 bg-neutral-800 p-4 rounded-lg">
                        <Image
                            src={await getAvatar()}
                            width={32}
                            height={32}
                            alt={user?.username ?? ""}
                            className="rounded-full"
                        />
                        <span>
                            <b>{user?.username}</b> ({user?.role.name})
                        </span>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Username
                        </label>
                        <Input name="username" value={user?.username ?? ""} />
                        <p className="text-[0.8rem] text-muted-foreground">
                            This is your public display name. It can be your
                            real name or a pseudonym.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Email
                        </label>
                        <Input name="email" value={user?.email ?? ""} />
                        <p className="text-[0.8rem] text-muted-foreground">
                            You can change your email address at any time.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Password
                        </label>
                        <Input name="password" type="password" />
                        <p className="text-[0.8rem] text-muted-foreground text-red-600">
                            Enter a new password if you want to change your
                            current one. Leave blank to keep your current
                            password.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Confirm Password
                        </label>
                        <Input name="confirm-password" type="password" />
                        <p className="text-[0.8rem] text-muted-foreground text-red-600">
                            Confirm your new password. Leave blank if you do not
                            want to change your password.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="default">Update</Button>
                    </div>
                </form>
            </div>
        </Body>
    );
}
