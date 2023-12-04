import Body from "@/components/body";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
    return (
        <Body title="404">
            <div className="space-y-8">
                <div>
                    <h2>Not Found</h2>
                    <p>Could not find requested resource</p>
                </div>
                <div>
                    <Link href="/">
                        <Button>Go back</Button>
                    </Link>
                </div>
            </div>
        </Body>
    );
}
