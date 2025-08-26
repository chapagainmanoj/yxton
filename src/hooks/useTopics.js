import { useEffect, useState } from "react";
import { db } from "../firebase/config"; // Adjust the import based on your Firebase setup
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const useTopics = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "topics"));
                const topicsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTopics(topicsData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const addTopic = async (name) => {
        try {
            const docRef = await addDoc(collection(db, "topics"), { name, notes: [] });
            setTopics(prev => [...prev, { id: docRef.id, name, notes: [] }]);
        } catch (err) {
            setError(err);
        }
    };

    const updateTopic = async (id, newName) => {
        try {
            const topicRef = doc(db, "topics", id);
            await updateDoc(topicRef, { name: newName });
            setTopics(prev => prev.map(topic => (topic.id === id ? { ...topic, name: newName } : topic)));
        } catch (err) {
            setError(err);
        }
    };

    const deleteTopic = async (id) => {
        try {
            const topicRef = doc(db, "topics", id);
            await deleteDoc(topicRef);
            setTopics(prev => prev.filter(topic => topic.id !== id));
        } catch (err) {
            setError(err);
        }
    };

    return { topics, loading, error, addTopic, updateTopic, deleteTopic };
};

export default useTopics;