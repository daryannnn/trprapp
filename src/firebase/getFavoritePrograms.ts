import {collection, getDocs, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default async function getFavoritePrograms(id: string) {
    let programIds: Array<string> = [];
    const docRef = collection(db, "Users", id, "User TrainingProgramsIds Favs");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
        programIds.push(doc.get("trainingProgramId"))
    });

    return programIds;
}