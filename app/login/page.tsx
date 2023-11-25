import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { checkCredentials } from "@/lib/user";

export default async function Login() {
    async function postLogin(formData: FormData) {
        "use server";

        const username = formData.get("username");
        const password = formData.get("password");

        // Use the user.login function to check if the user is valid
        const auth = await checkCredentials(
            username as string,
            password as string
        );

        // Check if user exists
        if (auth) {
            // Login success
            cookies().set("user", auth.toString());
            redirect("/");
        }

        // Return error
        return {
            status: 401,
            message: "Invalid username or password",
        };
    }

    return <LoginForm postLogin={postLogin} />;
}
