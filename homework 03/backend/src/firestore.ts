import {Firestore} from "@google-cloud/firestore";

const firestore = new Firestore({
    keyFilename: 'keyfile.json',
});

export class FirestoreService {
    static async addData(postId: string, collection: string, data: any) {
        const docRef = firestore.collection(collection).doc(postId);

        await docRef.set(data);
    }

    static async readData(collection: string, id: string) {
        return await firestore.collection(collection).doc(id).get();
    }

    static async readAllFromCollection(collection: string) {
        const snapshot = await firestore.collection(`posts`).get();

        const list: any[] = [];

        snapshot.forEach((doc) => {
            list.push(doc.data());
        })

        return list;
    }
    static async deletePost(collection: string, id: string) {
        return await firestore.collection(collection).doc(id).delete();
    }

}
