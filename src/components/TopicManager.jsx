import { useState, useContext } from "react";
import { TopicsContext } from "../contexts/TopicsContext";
import TopicCard from "./TopicCard";

const TopicManager = () => {
    const { topics, addTopic, updateTopic, deleteTopic, fetchNotes, addNote, updateNote, deleteNote } = useContext(TopicsContext);
    const [selected, setSelected] = useState(topics.length ? 0 : null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTopic, setNewTopic] = useState("");

    const handleAddTopicSave = async () => {
        const name = (newTopic || "").trim();
        if (!name) return;
        const created = await addTopic(name);
        setNewTopic("");
        setShowAddForm(false);
        // select newly created topic
        const idx = topics.length; // old length; new topic appended at end
        setSelected(idx);
    };

    const handleAddTopicCancel = () => {
        setNewTopic("");
        setShowAddForm(false);
    };

    const handleDeleteTopic = async (id) => {
        await deleteTopic(id);
        setSelected(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Topics</h1>
                <button
                    className="sm:hidden px-3 py-2 rounded-md bg-gray-100"
                    onClick={() => setShowAddForm((s) => !s)}
                    aria-label="Toggle add topic form"
                >
                    {showAddForm ? "Close" : "Add Topic"}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <aside className="w-full sm:w-1/4 bg-white p-4 rounded-lg shadow overflow-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold">My Topics</h2>
                    </div>

                    <div className="space-y-2 mb-3">
                        {topics.length === 0 && <p className="text-gray-500">No topics yet</p>}
                        {topics.map((t, i) => (
                            <div
                                key={t.id}
                                className={`p-3 rounded flex items-center justify-between cursor-pointer ${selected === i ? "bg-blue-50 border-l-4 border-blue-400" : "hover:bg-gray-50"}`}
                                onClick={() => setSelected(i)}
                            >
                                <div className="min-w-0">
                                    <div className="font-medium truncate">{t.name}</div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTopic(t.id);
                                    }}
                                    className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md"
                                    aria-label={`Delete topic ${t.name}`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        {showAddForm ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={newTopic}
                                    onChange={(e) => setNewTopic(e.target.value)}
                                    placeholder="Enter new topic"
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAddTopicSave} className="flex-1 bg-blue-600 px-3 py-2 rounded-lg text-white hover:bg-blue-700">
                                        Save
                                    </button>
                                    <button onClick={handleAddTopicCancel} className="flex-1 px-3 py-2 rounded-lg border">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full text-left px-3 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                + Add topic
                            </button>
                        )}
                    </div>
                </aside>

                <main className="flex-1">
                    {selected === null ? (
                        <div className="bg-white p-6 rounded-lg shadow h-full flex items-center justify-center">
                            <p className="text-gray-500">Select a topic to view or add notes</p>
                        </div>
                    ) : (
                        <TopicCard
                            topic={topics[selected]}
                            onUpdateName={(id, newName) => updateTopic(id, newName)}
                            onDelete={(id) => handleDeleteTopic(id)}
                            onAddNote={(topicId, text) => addNote(topicId, text)}
                            onUpdateNote={(topicId, noteId, text) => updateNote(topicId, noteId, text)}
                            onDeleteNote={(topicId, noteId) => deleteNote(topicId, noteId)}
                            onLoadNotes={(topicId) => fetchNotes(topicId)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default TopicManager;