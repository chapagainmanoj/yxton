import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

export const fetchTopics = async () => {
    try {
        const topicsCollection = collection(db, 'topics');
        const topicsSnapshot = await getDocs(topicsCollection);
        return topicsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("fetchTopics failed:", err?.code || err?.name, err?.message || err);
        throw err;
    }
};

export const addTopic = async (topic) => {
    try {
        const topicsCollection = collection(db, 'topics');
        const docRef = await addDoc(topicsCollection, topic);
        return { id: docRef.id, ...topic };
    } catch (err) {
        console.error("addTopic failed:", err?.code || err?.name, err?.message || err);
        if (String(err?.message).toLowerCase().includes('blocked') || err?.name === 'NetworkError') {
            throw new Error('Network request appears to be blocked by a browser extension or firewall. Try disabling adblock/privacy extensions, test in incognito, or use the Firestore emulator.');
        }
        throw err;
    }
};

export const updateTopic = async (id, updatedTopic) => {
    try {
        const topicDoc = doc(db, 'topics', id);
        await updateDoc(topicDoc, updatedTopic);
    } catch (err) {
        console.error("updateTopic failed:", err);
        throw err;
    }
};

export const deleteTopic = async (id) => {
    try {
        const topicDoc = doc(db, 'topics', id);
        await deleteDoc(topicDoc);
    } catch (err) {
        console.error("deleteTopic failed:", err);
        throw err;
    }
};