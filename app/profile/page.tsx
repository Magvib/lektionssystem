import { getUser, getAvatar, updateProfile } from "@/lib/user";
import ProfileForm from "@/components/profile-form";

export default async function page() {
    const user = await getUser();

    return (
        <ProfileForm
            user={user}
            userImage={await getAvatar()}
            updateProfile={updateProfile}
        />
    );
}
