import React from 'react'
import { useTodosApi } from './hooks/useTodoApi';
import AddTodoForm from './components/AddTodoForm';
import withLoading from './hoc/withLoading';
import TodoList from './components/TodoList';


const TodoListWithLoading = withLoading(TodoList);
const App = () => {
  const { todos, loading, addTodo, updateTodo, deleteTodo } = useTodosApi();

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <header className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800">React Todo List</h1>
          </header>

          <AddTodoForm addTodo={addTodo} />

          <TodoListWithLoading
            isLoading={loading}
            todos={todos}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
          />
        </div>
      </main>
    </div>
  );
}

export default App;