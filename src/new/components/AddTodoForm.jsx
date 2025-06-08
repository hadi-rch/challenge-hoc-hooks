import React, { useState } from 'react';

const AddTodoForm = ({ addTodo }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() === '') {
            return;
        }
        addTodo(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
                >
                    Add
                </button>
            </div>
        </form>
    );
};

export default AddTodoForm;