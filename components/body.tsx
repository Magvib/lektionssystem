import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

export default function Body({
    title,
    description,
    footer,
    children,
    ...props
}: {
    title?: any;
    description?: any;
    footer?: any;
    children?: any;
    [x: string]: any;
}) {
    return (
        <div className="container mx-auto pt-10">
            <Card {...props}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
                <CardFooter>{footer}</CardFooter>
            </Card>
        </div>
    );
}
