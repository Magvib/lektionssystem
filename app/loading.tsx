import Body from "@/components/body";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
    return (
        <Body title={<Skeleton className="h-12 w-full" />}>
            <Skeleton className="h-48 w-full" />
        </Body>
    );
}
