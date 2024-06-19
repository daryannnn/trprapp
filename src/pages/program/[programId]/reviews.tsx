import ReviewSurface from "@/components/reviews/ReviewSurface";
import {useRouter} from "next/router";
import React, {useMemo} from "react";

export default function Reviews() {
    const router = useRouter()
    const { programId} = useMemo(() => ({
        programId: router.query?.programId?.toString() ?? "",
    }), [router.query?.programId]);

    if (programId != "") {
        return (
            <>
                {<ReviewSurface programId={programId} currentUserId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserName={"Тренажерный зал"}/>}
            </>
        );
    } else {
        return (
            <div>
            </div>
        )
    }
}