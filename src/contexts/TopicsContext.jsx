import React, { createContext, useEffect, useState } from 'react';
import {
    fetchTopics as fetchTopicsAPI,
    addTopic as addTopicAPI,
    updateTopic as updateTopicAPI,
    deleteTopic as deleteTopicAPI,
    fetchNotes as fetchNotesAPI,
    addNote as addNoteAPI,
    updateNote as updateNoteAPI,
    deleteNote as deleteNoteAPI,
    loginWithEmail,
    registerWithEmail,
    logout as logoutAPI
} from '../utils/firebaseHelpers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

export const TopicsContext = createContext();

export const TopicsProvider = ({ children }) => {
    const [topics, setTopics] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u || null));
        const getTopics = async () => {
            try {
                const fetchedTopics = await fetchTopicsAPI();
                setTopics(fetchedTopics);
            } catch (err) {
                console.error("Failed to fetch topics:", err);
                setTopics([]);
            }
        };
        getTopics();
        return () => unsubAuth();
    }, []);

    // Topics CRUD
    const addTopic = async (name) => {
        const topicObj = { name: (name || "").trim(), createdAt: Date.now() };
        if (!topicObj.name) return null;
        try {
            const newTopic = await addTopicAPI(topicObj);
            setTopics((prev) => [...prev, newTopic]);
            return newTopic;
        } catch (err) {
            console.error("addTopic failed:", err);
            throw err;
        }
    };

    const updateTopic = async (id, newName) => {
        const trimmed = (newName || "").trim();
        if (!trimmed) return null;
        try {
            await updateTopicAPI(id, { name: trimmed });
            setTopics((prev) => prev.map(t => t.id === id ? { ...t, name: trimmed } : t));
            return { id, name: trimmed };
        } catch (err) {
            console.error("updateTopic failed:", err);
            throw err;
        }
    };

    const deleteTopic = async (id) => {
        try {
            await deleteTopicAPI(id);
            setTopics((prev) => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error("deleteTopic failed:", err);
            throw err;
        }
    };

    // Notes
    const fetchNotes = async (topicId) => {
        try {
            const notes = await fetchNotesAPI(topicId);
            setTopics((prev) => prev.map(t => t.id === topicId ? { ...t, notes } : t));
            return notes;
        } catch (err) {
            console.error("fetchNotes failed:", err);
            throw err;
        }
    };

    const addNote = async (topicId, text) => {
        try {
            const note = await addNoteAPI(topicId, text);
            setTopics((prev) => prev.map(t => t.id === topicId ? { ...t, notes: [...(t.notes || []), note] } : t));
            return note;
        } catch (err) {
            console.error("addNote failed:", err);
            throw err;
        }
    };

    const updateNote = async (topicId, noteId, text) => {
        try {
            await updateNoteAPI(topicId, noteId, text);
            setTopics((prev) => prev.map(t => {
                if (t.id !== topicId) return t;
                return { ...t, notes: (t.notes || []).map(n => n.id === noteId ? { ...n, text } : n) };
            }));
        } catch (err) {
            console.error("updateNote failed:", err);
            throw err;
        }
    };

    const deleteNote = async (topicId, noteId) => {
        try {
            await deleteNoteAPI(topicId, noteId);
            setTopics((prev) => prev.map(t => t.id === topicId ? { ...t, notes: (t.notes || []).filter(n => n.id !== noteId) } : t));
        } catch (err) {
            console.error("deleteNote failed:", err);
            throw err;
        }
    };

    // Auth
    const login = async (email, password) => {
        return loginWithEmail(email, password);
    };
    const register = async (email, password) => {
        return registerWithEmail(email, password);
    };
    const logout = async () => {
        return logoutAPI();
    };

    return (
        <TopicsContext.Provider value={{
            topics,
            user,
            addTopic,
            updateTopic,
            deleteTopic,
            fetchNotes,
            addNote,
            updateNote,
            deleteNote,
            login,
            register,
            logout
        }}>
            {children}
        </TopicsContext.Provider>
    );
};