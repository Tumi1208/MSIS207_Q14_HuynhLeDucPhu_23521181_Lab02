/** @jsx createElement */
import { createElement, useState, VNode, ComponentProps } from './jsx-runtime';

// --- Interfaces ---
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
interface TodoItemProps extends ComponentProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}
interface AddTodoFormProps extends ComponentProps {
  onAdd: (text: string) => void;
}

// --- Child Components ---

// Renders a single todo item
const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps): VNode => (
  <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
    <span>{todo.text}</span>
    <button className="btn-delete" onClick={() => onDelete(todo.id)}>
      Delete
    </button>
  </li>
);

// Form for adding new todos
const AddTodoForm = ({ onAdd }: AddTodoFormProps): VNode => {
  const [inputText, setInputText] = useState(''); // State for the input field

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const trimmedText = inputText().trim();
    if (trimmedText) {
      onAdd(trimmedText);
      setInputText(''); // Clear input after adding
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={inputText()}
        onInput={(e: Event) => setInputText((e.target as HTMLInputElement).value)}
        placeholder="What needs to be done?"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

// --- Main App Component ---
export const TodoApp = (): VNode => {
  const [todos, setTodos] = useState<Todo[]>([]); // Main state: list of todos

  // --- Actions ---
  const addTodo = (text: string) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false };
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const toggleTodo = (idToToggle: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === idToToggle ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (idToDelete: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== idToDelete));
  };

  // --- Calculations for display ---
  const totalCount = todos().length;
  const completedCount = todos().filter(t => t.completed).length;

  // --- Render ---
  return (
    <div className="todo-app app-widget">
      <h1>Todo List</h1>
      <AddTodoForm onAdd={addTodo} />
      <ul className="todo-list">
        {todos().map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
      <footer className="todo-summary">
        <p>Total: {totalCount} | Completed: {completedCount}</p>
      </footer>
    </div>
  );
};