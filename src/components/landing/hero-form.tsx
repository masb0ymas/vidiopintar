"use client";

import { handleVideoSubmit } from "@/app/actions"
import { SubmitButton } from "@/components/submit-button"
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { extractVideoId } from "@/lib/utils";

export function FormStartLearning() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const videoUrl = formData.get("videoUrl") as string;
        
        if (!session) {
            if (videoUrl) {
                const videoId = extractVideoId(videoUrl);
                if (videoId) {
                    // Store the video ID for redirect after login/register
                    sessionStorage.setItem("pendingVideoId", videoId);
                }
            }
            router.push("/register");
            return;
        }
        await handleVideoSubmit(formData);
    };

    return (
        <form
            action={handleSubmit}
            className="mx-auto max-w-md">
            <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.5rem)] border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                <input
                    placeholder="Paste YouTube URL"
                    className="h-12 pl-4 w-full bg-transparent focus:outline-none"
                    type="url"
                    name='videoUrl'
                />

                <div className="md:pr-1.5 lg:pr-0">
                    <SubmitButton label="Start learning" />
                </div>
            </div>
        </form>

    )
}