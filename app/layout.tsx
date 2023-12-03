import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Nav from "@/components/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: process.env.APP_NAME || "Lektionssystem",
    description: process.env.APP_DESCRIPTION || "Made by students for students",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} dark`}>
                <Nav />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
