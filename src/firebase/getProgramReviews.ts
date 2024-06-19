import {collection, getDocs, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default async function getProgramReviews(id: string) {
    let reviewIds: Array<string> = [];
    const docRef = collection(db, "Training Programs", id, "Training Program ReviewIds");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
        reviewIds.push(doc.get("reviewId"))
    });

    return reviewIds;
}