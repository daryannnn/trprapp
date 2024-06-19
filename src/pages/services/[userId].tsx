import React from "react";
import UserProgramsSurface from "@/components/UserProgramsSurface";
import {getAuth, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";

const auth = getAuth(firebase_app);

export default function UserPrograms() {
    signInWithEmailAndPassword(auth, "email@email.yr", "111111");
    return (
        <>
            {<UserProgramsSurface id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUserName={"Тренажерный зал"}/>}
        </>
    );
}