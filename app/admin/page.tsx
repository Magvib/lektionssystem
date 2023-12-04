import AddTeacher from "@/components/add-teacher";
import Body from "@/components/body";
import RemoveTeacher from "@/components/remove-teacher";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function page() {
    const user = await getUser();

    // Redirect if not teacher
    if (user?.role.name !== "Teacher") {
        redirect("/");
    }

    return (
        <Body title="Dashboard">
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium">Admin</h3>
                    <p className="text-sm text-muted-foreground">
                        This page is only accessible to teachers.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        And it is used to promote and demote teachers.
                    </p>
                </div>
                <Separator />
                <div>
                    <h1 className="text-2xl">Promote teacher</h1>
                    <AddTeacher />
                </div>
                <div>
                    <h1 className="text-2xl">Demote teacher</h1>
                    <RemoveTeacher />
                </div>
            </div>
        </Body>
    );
}
