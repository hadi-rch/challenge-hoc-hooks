import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoList from '../TodoList';
import TodoItem from '../TodoItem';
import React from 'react';

// Mock TodoItem to check if it's called with correct props
vi.mock('../TodoItem', () => ({
    default: vi.fn(({ todo, updateTodo, deleteTodo }) => (
        <li data-testid={`todo-item-${todo.id}`}>
            {todo.title}
            <button onClick={() => updateTodo(todo.id, { completed: !todo.completed })}>Toggle</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
    )),
}));

describe('TodoList', () => {
    const mockUpdateTodo = vi.fn();
    const mockDeleteTodo = vi.fn();

    it('renders an empty list when todos array is empty', () => {
        render(<TodoList todos={[]} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
        expect(TodoItem).not.toHaveBeenCalled();
    });

    it('renders a list of TodoItem components', () => {
        const todos = [
            { id: 1, title: 'Todo 1', completed: false },
            { id: 2, title: 'Todo 2', completed: true },
        ];

        render(<TodoList todos={todos} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(todos.length);

        expect(TodoItem).toHaveBeenCalledTimes(todos.length);
        expect(TodoItem).toHaveBeenCalledWith(expect.objectContaining({ todo: todos[0], updateTodo: mockUpdateTodo, deleteTodo: mockDeleteTodo }), undefined);
        expect(TodoItem).toHaveBeenCalledWith(expect.objectContaining({ todo: todos[1], updateTodo: mockUpdateTodo, deleteTodo: mockDeleteTodo }), undefined);

        expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
    });
});