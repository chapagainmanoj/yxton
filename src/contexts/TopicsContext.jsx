import React, { createContext, useEffect, useState } from 'react';
import {
    fetchTopics as fetchTopicsAPI,
    addTopic as addTopicAPI,
    updateTopic as updateTopicAPI,
    deleteTopic as deleteTopicAPI
} from '../utils/firebaseHelpers';

export const TopicsContext = createContext();

export const TopicsProvider = ({ children }) => {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
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
    }, []);

    // exposed API name = addTopic to match consumers
    const addTopic = async (name) => {
        const topicObj = { name: (name || "").trim(), notes: [] };
        if (!topicObj.name) return null;
        try {
            const newTopic = await addTopicAPI(topicObj);
            setTopics((prevTopics) => [...prevTopics, newTopic]);
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
            setTopics((prevTopics) =>
                prevTopics.map((topic) => (topic.id === id ? { ...topic, name: trimmed } : topic))
            );
            return { id, name: trimmed };
        } catch (err) {
            console.error("updateTopic failed:", err);
            throw err;
        }
    };

    const deleteTopic = async (id) => {
        try {
            await deleteTopicAPI(id);
            setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== id));
        } catch (err) {
            console.error("deleteTopic failed:", err);
            throw err;
        }
    };

    return (
        <TopicsContext.Provider value={{ topics, addTopic, updateTopic, deleteTopic }}>
            {children}
        </TopicsContext.Provider>
    );
};