import Body from "@/components/body";
import GradeList from "@/components/grade-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function page() {
    return (
        <Body title="Grades">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl">List of grades</h1>
                    <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                        <GradeList />
                    </Suspense>
                </div>
            </div>
        </Body>
    );
}
