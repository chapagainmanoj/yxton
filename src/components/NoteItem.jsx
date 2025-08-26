import React from 'react';

const NoteItem = ({ note, onUpdate, onDelete }) => {
    const handleUpdate = () => {
        const newText = prompt("Edit note:", note.text);
        if (newText !== null) {
            onUpdate(newText);
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            onDelete();
        }
    };

    return (
        <div className="flex justify-between items-center p-2 border-b">
            <span className="flex-1">{note.text}</span>
            <div className="flex items-center space-x-2">
                <button onClick={handleUpdate} className="text-blue-600 hover:text-blue-800">
                    Edit
                </button>
                <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default NoteItem;