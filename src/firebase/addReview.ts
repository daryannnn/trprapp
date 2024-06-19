import {
    addDoc,
    collection, doc,
    getCountFromServer,
    getFirestore, increment,
    query, setDoc,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export const addReview = async (authorId: string,
                                  authorName: string,
                                  authorType: string,
                                authorProfilePhotoUrl: string,
                                  title: string,
                                  text: string,
                                  rating: number,
                                programId: string,
                                currentRating: number,
                                currentCount: number,
) => {
    try {
        const docRef = await addDoc(collection(db, "Training Program Reviews"), {
            authorId,
            authorName,
            authorType,
            title,
            text,
            rating,
            dateCreated: Timestamp.fromDate(new Date()),
            authorProfilePhotoUrl,
        })
        await updateDoc(doc(getFirestore(firebase_app), "Training Programs", programId), {
            rating: (currentRating + rating) / (currentCount + 1),
            reviewsCount: increment(1),
        });
        await setDoc(doc(getFirestore(firebase_app), "Training Programs", programId, "Training Program ReviewIds", docRef.id), {
            reviewId: docRef.id,
        });
    } catch (err) {
        console.error(err)
    }
}