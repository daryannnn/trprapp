import {collection, doc, documentId, getDoc, getDocs, getFirestore, orderBy, query, where} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default async function searchPrograms(name: string, goal: string, rating: number | null) {
    let eventsIds: Array<string> = [];

    const querySnapshotUsers = await getDocs(query(collection(db, "Training Programs")));
    querySnapshotUsers.forEach((doc) => {
        eventsIds.push(doc.id);
    });

    if (rating) {
        let ratingIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Training Programs"), where("rating", ">=", Number(rating))));
        querySnapshot.forEach((doc) => ratingIds.push(doc.id))
        await Promise.all(eventsIds.map(async (userId, index) => {
            if (!ratingIds.includes(userId)) {
                delete eventsIds[index]
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (goal.length > 0) {
        let goalIds: Array<string> = [];
        const querySnapshot = await getDocs(query(collection(db, "Training Programs"), where("serviceGoal", "==", goal)));
        querySnapshot.forEach((doc) => goalIds.push(doc.id))
        await Promise.all(eventsIds.map(async (userId, index) => {
            if (!goalIds.includes(userId)) {
                delete eventsIds[index]
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    if (name.length > 0) {
        await Promise.all(eventsIds.map(async (eventId, index) => {
            const docRef = doc(db, "Training Programs", eventId);
            const docSnap = await getDoc(docRef);
            if (!((docSnap.get("title").toLowerCase()).match(new RegExp(name.toLowerCase())))) {
                delete eventsIds[index]
            }
        }))
        eventsIds = eventsIds.filter(function( element ) {
            return element !== undefined;
        });
    }

    return eventsIds;
}