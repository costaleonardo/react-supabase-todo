import { useTodo } from "@/context/TodoContext";
import { TodoItem } from "./TodoItem";
import { TodoInput } from "./TodoInput";
import { AuthButton } from "./auth/AuthButton";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, toggleImportant, isLoading } =
    useTodo();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AuthButton />
      </div>
      {user ? (
        <>
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
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            Please sign in to manage your todos
          </p>
        </div>
      )}
    </div>
  );
}