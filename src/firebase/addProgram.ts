import {
    addDoc, arrayUnion,
    collection,
    doc,
    getCountFromServer,
    getFirestore,
    query,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {getStorage, ref, uploadBytes} from "@firebase/storage";

const db = getFirestore(firebase_app)
const storage = getStorage(firebase_app);

export const addProgram = async (title: string,
                               authorId: string,
                               authorName: string,
                               authorType: string,
                                 authorProfilePhotoUrl: string,
                               generalDescription: string,
                                 detailedDescription: string,
                                 serviceGoal: string,
                                 generalImages: File[] | null,
                                 detailedImages: File[] | null,
) => {
    try {
        await addDoc(collection(db, "Training Programs"), {
            title,
            authorId,
            authorName,
            authorType,
            generalDescription,
            detailedDescription,
            serviceGoal,
            price: 0,
            dateCreated: Timestamp.fromDate(new Date()),
            acquiredCount: 0,
            reviewsCount: 0,
            rating: 0,
            authorProfilePhotoUrl,
            generalImagesUrls: [],
            detailedImagesUrls: [],
        }).then((newProgram) => {
            if (generalImages != null) {
                generalImages.map(async image => {
                    const storageRef = ref(storage, `images/services/training_programs/` + newProgram.id + '/general/' + image.name);
                    await uploadBytes(storageRef, image).then(() => {
                        console.log("storage uploaded successfully")
                        updateDoc(doc(db, "Training Programs", newProgram.id), {
                            generalImagesUrls: arrayUnion(`images/services/training_programs/` + newProgram.id + '/general/' + image.name)
                        }).then(() => console.log("program doc uploaded successfully"));
                    })
                    /*await updateDoc(doc(db, "Training Programs", newProgram.id), {
                        generalImagesUrls: arrayUnion(`images/services/training_programs/` + newProgram.id + '/general/' + image.name)
                    });*/
                })
            }
            if (detailedImages != null) {
                detailedImages.map(async image => {
                    const storageRef = ref(storage, `images/services/training_programs/` + newProgram.id + '/detailed/' + image.name);
                    await uploadBytes(storageRef, image).then(() => {
                        updateDoc(doc(db, "Training Programs", newProgram.id), {
                            detailedImagesUrls: arrayUnion(`images/services/training_programs/` + newProgram.id + '/detailed/' + image.name)
                        });
                    });
                    /*await updateDoc(doc(db, "Training Programs", newProgram.id), {
                        detailedImagesUrls: arrayUnion(`images/services/training_programs/` + newProgram.id + '/detailed/' + image.name)
                    });*/
                })
            }
        })

        const q = query(collection(db, "Training Programs"), where("authorId", "==", authorId));
        const count = await getCountFromServer(q);
        await updateDoc(doc(getFirestore(firebase_app), "Users", authorId), {
            servicesCount: count.data().count,
        });
    } catch (err) {
        console.error(err)
    }
}