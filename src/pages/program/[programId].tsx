import React, {useCallback, useEffect, useMemo} from "react";
import ProgramSurface from "@/components/ProgramSurface";
import {useRouter} from "next/router";
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";

const auth = getAuth(firebase_app);

export default function Program() {
    signInWithEmailAndPassword(auth, "gym@gym.yr", "111111");

    const router = useRouter()
    const { programId} = useMemo(() => ({
        programId: router.query?.programId?.toString() ?? "",
    }), [router.query?.programId]);

    if (programId != "") {
        return (
            <>
                <ProgramSurface id={programId} currentUserId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"}/>
            </>
        );
    } else {
        return (
            <div>
            </div>
        )
    }
}