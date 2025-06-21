import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTodosApi } from '../useTodoApi';
import Swal from 'sweetalert2';

// Mock global fetch
global.fetch = vi.fn();

// Mock Swal
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn(),
    },
}));

const mockTodos = [
    { id: 1, title: 'Todo 1', completed: false, userId: 1 },
    { id: 2, title: 'Todo 2', completed: true, userId: 1 },
];

const createFetchResponse = (data, ok = true) => ({
    json: () => new Promise(resolve => resolve(data)),
    ok: ok,
    status: ok ? 200 : 500,
});

describe('useTodosApi', () => {
    beforeEach(() => {
        // Reset mocks before each test
        fetch.mockClear();
        Swal.fire.mockClear();
    });

    it('should fetch todos on mount', async () => {
        fetch.mockResolvedValue(createFetchResponse(mockTodos));

        const { result } = renderHook(() => useTodosApi());

        // Initial state
        expect(result.current.loading).toBe(true);
        expect(result.current.todos).toEqual([]);

        // Wait for fetch to complete and state to update
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.todos).toEqual(mockTodos);
        });

        expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos?_limit=10');
    });

    it('should handle fetch error', async () => {
        fetch.mockRejectedValue(new Error('Failed to fetch'));

        const { result } = renderHook(() => useTodosApi());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.todos).toEqual([]);
        expect(Swal.fire).toHaveBeenCalledWith({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal ambil data!',
        });
    });

    it('should add a todo', async () => {
        const newTodoTitle = 'New Task';
        const addedTodo = { id: 3, title: newTodoTitle, completed: false, userId: 1 };

        // Mock initial fetch
        fetch.mockResolvedValueOnce(createFetchResponse(mockTodos));
        // Mock add todo fetch
        fetch.mockResolvedValueOnce(createFetchResponse(addedTodo));

        const { result } = renderHook(() => useTodosApi());

        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Call addTodo
        await result.current.addTodo(newTodoTitle);

        // Check fetch call for adding
        expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
                title: newTodoTitle,
                userId: 1,
                completed: false,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        // Check state update (new todo should be at the beginning)
        await waitFor(() => {
            expect(result.current.todos).toEqual([addedTodo, ...mockTodos]);
        });

        // Check Swal call
        expect(Swal.fire).toHaveBeenCalledWith({
            icon: 'success',
            title: 'Berhasil',
            text: 'Berhasil Tambah Todo.',
            showConfirmButton: false,
        });
    });

    it('should handle addTodo error', async () => {
        const newTodoTitle = 'New Task';

        // Mock initial fetch
        fetch.mockResolvedValueOnce(createFetchResponse(mockTodos));
        // Mock add todo fetch error
        fetch.mockRejectedValueOnce(new Error('Failed to add'));

        const { result } = renderHook(() => useTodosApi());

        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Call addTodo
        await result.current.addTodo(newTodoTitle);

        // Check state did not change
        expect(result.current.todos).toEqual(mockTodos);

        // Check Swal call
        expect(Swal.fire).toHaveBeenCalledWith({
            icon: 'error',
            title: 'Error',
            text: 'Gagal tambah todo.',
        });
    });

    it('should update a todo', async () => {
        const todoToUpdateId = 1;
        const updatedData = { completed: true };
        const updatedTodo = { ...mockTodos[0], ...updatedData };

        // Mock initial fetch
        fetch.mockResolvedValueOnce(createFetchResponse(mockTodos));
        // Mock update todo fetch (jsonplaceholder PUT returns the updated object)
        fetch.mockResolvedValueOnce(createFetchResponse(updatedTodo));

        const { result } = renderHook(() => useTodosApi());

        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Call updateTodo
        await result.current.updateTodo(todoToUpdateId, updatedData);

        // Check fetch call for updating
        expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/todos/${todoToUpdateId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        // Check state update
        await waitFor(() => {
            expect(result.current.todos.find(t => t.id === todoToUpdateId)).toEqual(updatedTodo);
        });
    });

    it('should handle updateTodo error', async () => {
        const todoToUpdateId = 1;
        const updatedData = { completed: true };

        // Mock initial fetch
        fetch.mockResolvedValueOnce(createFetchResponse(mockTodos));
        // Mock update todo fetch error
        fetch.mockRejectedValueOnce(new Error('Failed to update'));

        const { result } = renderHook(() => useTodosApi());

        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Call updateTodo
        await result.current.updateTodo(todoToUpdateId, updatedData);

        // Check state did not change
        expect(result.current.todos).toEqual(mockTodos);
        // No Swal call expected for update error based on current implementation
        expect(Swal.fire).not.toHaveBeenCalled();
    });

    it('should delete a todo when confirmed', async () => {
        const todoToDeleteId = 1;

        // Mock initial fetch
        fetch.mockResolvedValueOnce(createFetchResponse(mockTodos));
        // Mock delete todo fetch
        fetch.mockResolvedValueOnce(createFetchResponse({}, true)); // Successful delete returns empty body

        // Mock Swal confirm
        Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

        const { result } = renderHook(() => useTodosApi());

        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Call deleteTodo
        await result.current.deleteTodo(todoToDeleteId);

        // Check Swal confirmation call
        expect(Swal.fire).toHaveBeenCalledWith({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        // Check fetch call for deleting
        expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/todos/${todoToDeleteId}`, {
            method: 'DELETE',
        });

        // Check state update (todo should be removed)
        await waitFor(() => {
            expect(result.current.todos).toEqual(mockTodos.filter(todo => todo.id !== todoToDeleteId));
        });

        // Check Swal success call
        expect(Swal.fire).toHaveBeenCalledWith({
            title: 'Deleted!',
            text: 'Todo Berhasil dihapus.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
        });
    });

    it('should not delete a todo when cancelled', async () => {
        const todoToDeleteId = 1;

        // Mock initial fetch
        fetch.mockResolvedValueOnce(createFetchResponse(mockTodos));

        // Mock Swal cancel
        Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

        const { result } = renderHook(() => useTodosApi());

        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Call deleteTodo
        await result.current.deleteTodo(todoToDeleteId);

        // Check Swal confirmation call
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: 'warning' }));

        // Check fetch was NOT called for deleting
        expect(fetch).not.toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/todos/${todoToDeleteId}`, expect.anything());

        // Check state did not change
        expect(result.current.todos).toEqual(mockTodos);

        // Check Swal success was NOT called
        expect(Swal.fire).not.toHaveBeenCalledWith(expect.objectContaining({ icon: 'success' }));
    });

    it('should handle deleteTodo error after confirmation', async () => {
        const todoToDeleteId = 1;

        // Mock initial fetch
        fetch.mockResolvedValueOnce(createFetchResponse(mockTodos));
        // Mock delete todo fetch error
        fetch.mockRejectedValueOnce(new Error('Failed to delete'));

        // Mock Swal confirm
        Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

        const { result } = renderHook(() => useTodosApi());

        // Wait for initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Call deleteTodo
        await result.current.deleteTodo(todoToDeleteId);

        // Check fetch call for deleting
        expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/todos/${todoToDeleteId}`, {
            method: 'DELETE',
        });

        // Check state did not change (or reverted if it changed before catch)
        // In this implementation, state only updates after successful fetch, so it shouldn't change
        expect(result.current.todos).toEqual(mockTodos);

        // Panggilan pertama ke Swal.fire adalah untuk konfirmasi
        expect(Swal.fire).toHaveBeenNthCalledWith(1, {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        // Panggilan kedua ke Swal.fire adalah untuk pesan error setelah fetch gagal
        expect(Swal.fire).toHaveBeenNthCalledWith(2, {
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the todo.',
        });
    });
});