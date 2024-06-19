import React, {useMemo} from "react";
import ExerciseSurface from "@/components/exercises/ExerciseSurface";
import {useRouter} from "next/router";

export default function Exercise() {
    const router = useRouter()
    const { programId, exerciseId } = useMemo(() => ({
        programId: router.query?.programId?.toString() ?? "",
        exerciseId: router.query?.exerciseId?.toString() ?? "",
    }), [router.query?.programId, router.query?.exerciseId]);

    if (programId != null && exerciseId != null) {
        return (
            <>
                <ExerciseSurface programId={programId} exerciseId={exerciseId}/>
            </>
        );
    } else {
        return (
            <div>

            </div>
        )
    }
}