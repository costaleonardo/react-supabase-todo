import React, { createContext, useContext, useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleImportant: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching todos",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setTodos(data || []);
      }
      setIsLoading(false);
    };

    fetchTodos();

    const subscription = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTodos((prev) => [payload.new as Todo, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setTodos((prev) =>
              prev.filter((todo) => todo.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setTodos((prev) =>
              prev.map((todo) =>
                todo.id === payload.new.id ? (payload.new as Todo) : todo
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const addTodo = async (text: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add todos",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("todos").insert({
      text,
      user_id: session.session.user.id,
    });

    if (error) {
      toast({
        title: "Error adding todo",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Todo added",
        description: "Your todo has been added successfully.",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting todo",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Todo deleted",
        description: "Your todo has been deleted.",
        variant: "destructive",
      });
    }
  };

  const toggleImportant = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ important: !todo.important })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating todo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        toggleImportant,
        isLoading,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}