import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoItem from '../TodoItem';
import React from 'react';

describe('TodoItem', () => {
    const mockTodo = { id: 1, title: 'Test Todo', completed: false };
    const mockUpdateTodo = vi.fn();
    const mockDeleteTodo = vi.fn();

    it('renders the todo title and checkbox', () => {
        render(<TodoItem todo={mockTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('checkbox reflects the completed status', () => {
        const completedTodo = { ...mockTodo, completed: true };
        const incompleteTodo = { ...mockTodo, completed: false };

        const { rerender } = render(<TodoItem todo={incompleteTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
        expect(screen.getByRole('checkbox')).not.toBeChecked();
        expect(screen.getByText('Test Todo')).not.toHaveClass('line-through');

        rerender(<TodoItem todo={completedTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
        expect(screen.getByText('Test Todo')).toHaveClass('line-through');
    });

    it('calls updateTodo when checkbox is clicked', () => {
        render(<TodoItem todo={mockTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockUpdateTodo).toHaveBeenCalledWith(mockTodo.id, { completed: !mockTodo.completed });
    });

    it('calls deleteTodo when delete button is clicked', () => {
        render(<TodoItem todo={mockTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(mockDeleteTodo).toHaveBeenCalledWith(mockTodo.id);
    });
});