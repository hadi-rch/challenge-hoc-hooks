import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AddTodoForm from '../AddTodoForm';
import React from 'react';

describe('AddTodoForm', () => {
    it('renders the form with input and button', () => {
        render(<AddTodoForm addTodo={() => { }} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('updates input value on change', () => {
        render(<AddTodoForm addTodo={() => { }} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Todo' } });
        expect(input).toHaveValue('New Todo');
    });

    it('calls addTodo and clears input on submit with text', () => {
        const addTodoMock = vi.fn();
        render(<AddTodoForm addTodo={addTodoMock} />);
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /add/i });

        fireEvent.change(input, { target: { value: 'Test Todo' } });
        fireEvent.click(button);

        expect(addTodoMock).toHaveBeenCalledWith('Test Todo');
        expect(input).toHaveValue('');
    });

    it('does not call addTodo and does not clear input on submit with empty text', () => {
        const addTodoMock = vi.fn();
        render(<AddTodoForm addTodo={addTodoMock} />);
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button', { name: /add/i });

        fireEvent.change(input, { target: { value: '   ' } }); // Test with whitespace
        fireEvent.click(button);

        expect(addTodoMock).not.toHaveBeenCalled();
        expect(input).toHaveValue('   '); // Input value should not be cleared

        fireEvent.change(input, { target: { value: '' } }); // Test with empty string
        fireEvent.click(button);

        expect(addTodoMock).not.toHaveBeenCalled();
        expect(input).toHaveValue(''); // Input value should not be cleared
    });
});