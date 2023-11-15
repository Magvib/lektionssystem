// Get cookie from browser
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import prisma from './db';

export async function getUser() {
    const user = cookies().get('user')
    if (user) {
        const userId = parseInt(user.value, 10);
        if (!isNaN(userId)) {
            return await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    role: true,
                    managedTeams: {
                        include: {
                            members: true,
                            manager: true,
                            tasks: true,
                        },
                    },
                },
            })
        }
    }
    return null
}

export async function logout() {
    'use server'
    cookies().delete('user');
    redirect('/login');
}