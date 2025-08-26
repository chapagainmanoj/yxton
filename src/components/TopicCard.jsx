import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";

const TopicCard = ({ topic, onUpdateName, onDelete, onAddNote, onUpdateNote, onDeleteNote, onLoadNotes }) => {
    const [newNote, setNewNote] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [topicName, setTopicName] = useState("");

    useEffect(() => {
        setTopicName(topic?.name || "");
        setNewNote("");
        setIsEditingName(false);
        if (topic && !topic.notes) {
            onLoadNotes?.(topic.id);
        }
    }, [topic]);

    if (!topic) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-500">No topic selected</p>
            </div>
        );
    }

    const handleAddNote = async () => {
        const text = (newNote || "").trim();
        if (!text) return;
        await onAddNote?.(topic.id, text);
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
                            if (next && next !== topic.name) onUpdateName?.(topic.id, next);
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
                {!(topic.notes || []).length && <p className="text-gray-500">No notes yet</p>}
                {(topic.notes || []).map((n) => (
                    <NoteItem
                        key={n.id}
                        note={n}
                        onUpdate={(updatedText) => onUpdateNote?.(topic.id, n.id, updatedText)}
                        onDelete={() => onDeleteNote?.(topic.id, n.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TopicCard;