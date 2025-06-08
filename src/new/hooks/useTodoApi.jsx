import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

export const useTodosApi = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodos = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}?_limit=10`);
                const data = await response.json();
                setTodos(data);
            } catch (error) {
                console.log("gagal fetch todos:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Gagal ambil data!',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    const addTodo = useCallback(async (title) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    userId: 1,
                    completed: false,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const newTodo = await response.json();
            setTodos(prevTodos => [newTodo, ...prevTodos]);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Berhasil Tambah Todo.',
                showConfirmButton: false,
            });

        } catch (error) {
            console.error("Gagal tambah todo:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal tambah todo.',
            });
        }
    }, []);

    const updateTodo = useCallback(async (id, updatedTodo) => {
        try {
            await fetch(`${BASE_URL}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedTodo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            setTodos(prevTodos =>
                prevTodos.map(todo => (todo.id === id ? { ...todo, ...updatedTodo } : todo))
            );
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    }, []);

    const deleteTodo = useCallback(async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`${BASE_URL}/${id}`, {
                        method: 'DELETE',
                    });
                    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Todo Berhasil dihapus.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                    });

                } catch (error) {
                    console.error("Failed to delete todo:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete the todo.',
                    });
                }
            }
        });
    }, []);

    return { todos, loading, addTodo, updateTodo, deleteTodo };
};