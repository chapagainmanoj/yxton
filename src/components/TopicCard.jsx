import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

const TopicCard = ({ topic, onUpdateName, onDelete, onAddNote, onUpdateNote, onDeleteNote }) => {
    const [newNote, setNewNote] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [topicName, setTopicName] = useState("");

    // keep local name in sync when topic changes (and avoid crash if topic is undefined)
    useEffect(() => {
        setTopicName(topic?.name || "");
        setNewNote("");
        setIsEditingName(false);
    }, [topic]);

    // if topic is not provided yet, render a placeholder (avoids reading .name of undefined)
    if (!topic) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500">No topic selected</p>
            </div>
        );
    }

    const handleAddNote = () => {
        const text = (newNote || "").trim();
        if (!text) return;
        onAddNote?.(text);
        setNewNote("");
    };

    return (
        <div className="bg-white shadow p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
                {isEditingName ? (
                    <input
                        className="border px-2 py-1 rounded w-full mr-2"
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        onBlur={() => {
                            const next = (topicName || "").trim();
                            if (next && next !== topic.name) onUpdateName?.(next);
                            setIsEditingName(false);
                        }}
                        autoFocus
                    />
                ) : (
                    <h3
                        className="text-lg font-semibold cursor-pointer"
                        onClick={() => setIsEditingName(true)}
                    >
                        {topic.name}
                    </h3>
                )}

                <button
                    onClick={() => onDelete?.(topic.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                    aria-label="Delete topic"
                >
                    ✕
                </button>
            </div>

            <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type something..."
                rows={3}
                className="w-full border rounded-lg p-2 mb-2"
            />
            <div className="flex gap-2 mb-4">
                <button
                    onClick={handleAddNote}
                    className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 text-white"
                >
                    Save
                </button>
                <button onClick={() => setNewNote("")} className="px-3 py-1 rounded-lg border">
                    Clear
                </button>
            </div>

            <div className="mt-3 space-y-2">
                {(topic.notes || []).length === 0 && <p className="text-gray-500">No notes yet</p>}
                {(topic.notes || []).map((n, idx) => (
                    <NoteItem
                        key={idx}
                        note={n}
                        onUpdate={(updatedText) => onUpdateNote?.(topic.id, idx, updatedText)}
                        onDelete={() => onDeleteNote?.(topic.id, idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopicCard;