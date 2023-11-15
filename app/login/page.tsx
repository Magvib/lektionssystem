import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import prisma from '@/lib/db'


export default async function Login() {
    async function postLogin(formData: FormData) {
        'use server'

        const username = formData.get('username')
        const password = formData.get('password')

        // Get user by username
        const user = await prisma.user.findUnique({
            where: {
                username: username as string,
            },
        })

        // Check if user exists
        if (
            user
            && bcrypt.compareSync(password as string, user.password as string)
        ) {
            // Login success
            cookies().set('user', user.id.toString())
            redirect('/')
        }
    }

    return (
        <form className='mx-auto w-1/2 pt-10' action={postLogin}>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Student / Teacher</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="username">Username</Label>
                    <Input name="username" type="text" placeholder="Username" />
                    <br />
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" placeholder="Password" />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="submit">Login</Button>
                    <Link href="/register">
                        <Button type="submit" variant={'secondary'}>Register</Button>
                    </Link>
                </CardFooter>
            </Card>
        </form>
    )
}
