import {getFirestore, doc, getDoc, where, collection, getDocs, orderBy} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {query} from "@firebase/database";

const db = getFirestore(firebase_app)

export default async function getUsersPrograms(id: string) {
    // @ts-ignore
    const q = query(collection(db, "Training Programs"), where("authorId", "==", id), orderBy("dateCreated", "desc"));
    let programIds: Array<string> = [];
    // @ts-ignore
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        programIds.push(doc.id)
    });

    return programIds;
}