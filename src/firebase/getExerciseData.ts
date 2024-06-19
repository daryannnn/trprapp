import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)
export default async function getExerciseData(programId: string, exerciseId: string) {
    let docRef = doc(db, "Training Programs", programId, "Exercises", exerciseId);

    let result = null;
    let error = null;

    try {
        result = (await getDoc(docRef)).data();
        console.log(result)
    } catch (e) {
        error = e;
    }

    return { result, error };
}