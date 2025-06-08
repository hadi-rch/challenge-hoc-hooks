import React from 'react';

const TodoItem = ({ todo, updateTodo, deleteTodo }) => {
    const handleToggle = () => {
        updateTodo(todo.id, { completed: !todo.completed });
    };

    const handleDelete = () => {
        deleteTodo(todo.id);
    };

    return (
        <li className="flex items-center justify-between p-3 mb-2 bg-white border rounded-md shadow-sm">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggle}
                    className="h-5 w-5 rounded text-blue-500 focus:ring-blue-400 cursor-pointer"
                />
                <span className={`ml-3 text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.title}
                </span>
            </div>
            <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 font-semibold"
            >
                Delete
            </button>
        </li>
    );
};

export default TodoItem;