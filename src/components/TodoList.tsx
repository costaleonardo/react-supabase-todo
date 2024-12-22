import { useTodo } from "@/context/TodoContext";
import { TodoItem } from "./TodoItem";
import { TodoInput } from "./TodoInput";

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, toggleImportant } = useTodo();

  return (
    <div className="space-y-6">
      <TodoInput onAdd={addTodo} />
      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onToggleImportant={toggleImportant}
          />
        ))}
        {todos.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No todos yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}