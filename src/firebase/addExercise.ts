import {addDoc, arrayUnion, collection, doc, getFirestore, Timestamp, updateDoc} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {getStorage, ref, uploadBytes} from "@firebase/storage";

const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);

export const addExercise = async (programId: string,
                                  name: string,
                                 description: string,
                                 setsNumber: number,
                                 repsNumber: number,
                                  regularity: string,
                                  images: File[] | null,
) => {
    try {
        await addDoc(collection(db, "Training Programs", programId, "Exercises"), {
            name,
            description,
            setsNumber,
            repsNumber,
            regularity,
            dateCreated: Timestamp.fromDate(new Date()),
            imagesUrls: [],
        }).then((newExercise) => {
            if (images != null) {
                images.map(async image => {
                    const storageRef = ref(storage, `images/services/training_programs/` + programId + '/exercises/' + newExercise.id + '/' + image.name);
                    await uploadBytes(storageRef, image);
                    await updateDoc(doc(db, "Training Programs", programId, "Exercises", newExercise.id), {
                        imagesUrls: arrayUnion(`images/services/training_programs/` + programId + '/exercises/' + newExercise.id + '/' + image.name)
                    });
                })
            }
        })
    } catch (err) {
        console.error(err)
    }
}