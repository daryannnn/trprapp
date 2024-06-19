import {collection, documentId, getDocs, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default async function getProgramExercises(id: string) {
    let exIds: Array<string> = [];
    const docRef = collection(db, "Training Programs", id, "Exercises");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
        exIds.push(doc.id)
    });

    return exIds;
}