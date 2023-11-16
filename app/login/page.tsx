import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import prisma from '@/lib/db'
import LoginForm from './loginForm'


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

        // Return error
        return {
            status: 401,
            message: 'Invalid username or password',
        }
    }

    return (
        <LoginForm postLogin={postLogin} />
    )
}
