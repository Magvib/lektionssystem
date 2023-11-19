'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useToast } from "@/components/ui/use-toast"

export default function RegisterForm({ postRegister }: { postRegister: any }) {
    const { toast } = useToast()

    async function clientAction(formData: FormData) {
        var error = await postRegister(formData)
        error = JSON.parse(error)

        if (error) {
            toast({
                variant: "destructive",
                title: "Error" + ' (' + error.issues[0].path + ')',
                description: error.issues[0].message,
                duration: 5000,
            })
        }
    }

    return (
        <form className='mx-auto w-2/3 pt-10' action={clientAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Student</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="username">Username</Label>
                    <Input name="username" type="text" placeholder="Username" />
                    <br />
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="text" placeholder="Email" />
                    <br />
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" placeholder="Password" />
                    <br />
                    <Label htmlFor="password_confirm">Password confirm</Label>
                    <Input name="password_confirm" type="password" placeholder="Password confirm" />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="submit">Register</Button>
                    <Link href="/login">
                        <Button type="submit" variant={'secondary'}>Login</Button>
                    </Link>
                </CardFooter>
            </Card>
        </form>
    )
}
