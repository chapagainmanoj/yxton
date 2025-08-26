import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { auth } from '../firebase/config';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';

// Topics
export const fetchTopics = async () => {
    try {
        const topicsCollection = collection(db, 'topics');
        const q = query(topicsCollection, orderBy('__name__', 'asc'));
        const topicsSnapshot = await getDocs(q);
        return topicsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("fetchTopics failed:", err?.code || err?.name, err?.message || err);
        throw err;
    }
};

export const addTopic = async (topic) => {
    try {
        const topicsCollection = collection(db, 'topics');
        const docRef = await addDoc(topicsCollection, { ...topic, createdAt: serverTimestamp() });
        return { id: docRef.id, ...topic };
    } catch (err) {
        console.error("addTopic failed:", err?.code || err?.name, err?.message || err);
        throw err;
    }
};

export const updateTopic = async (id, updatedTopic) => {
    try {
        const topicDoc = doc(db, 'topics', id);
        await updateDoc(topicDoc, { ...updatedTopic, updatedAt: serverTimestamp() });
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

// Notes as subcollection: topics/{topicId}/notes
export const fetchNotes = async (topicId) => {
    try {
        const notesCol = collection(db, 'topics', topicId, 'notes');
        const q = query(notesCol, orderBy('createdAt', 'asc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("fetchNotes failed:", err);
        throw err;
    }
};

export const addNote = async (topicId, text) => {
    const t = (text || "").trim();
    if (!t) return null;
    try {
        const notesCol = collection(db, 'topics', topicId, 'notes');
        const docRef = await addDoc(notesCol, { text: t, createdAt: serverTimestamp() });
        // return the note shape
        const noteDoc = await getDoc(docRef);
        return { id: docRef.id, ...(noteDoc.data() || {}) };
    } catch (err) {
        console.error("addNote failed:", err);
        throw err;
    }
};

export const updateNote = async (topicId, noteId, newText) => {
    const t = (newText || "").trim();
    if (!t) return null;
    try {
        const noteDoc = doc(db, 'topics', topicId, 'notes', noteId);
        await updateDoc(noteDoc, { text: t, updatedAt: serverTimestamp() });
        return { id: noteId, text: t };
    } catch (err) {
        console.error("updateNote failed:", err);
        throw err;
    }
};

export const deleteNote = async (topicId, noteId) => {
    try {
        const noteDoc = doc(db, 'topics', topicId, 'notes', noteId);
        await deleteDoc(noteDoc);
        return { id: noteId };
    } catch (err) {
        console.error("deleteNote failed:", err);
        throw err;
    }
};

// Auth helpers
export const loginWithEmail = async (email, password) => {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
    } catch (err) {
        console.error("loginWithEmail failed:", err);
        throw err;
    }
};

export const registerWithEmail = async (email, password) => {
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        return cred.user;
    } catch (err) {
        console.error("registerWithEmail failed:", err);
        throw err;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (err) {
        console.error("logout failed:", err);
        throw err;
    }
};