import { Todo } from "@/types/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleImportant: (id: string) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onToggleImportant,
}: TodoItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border transition-all animate-slide-in",
        todo.completed && "opacity-50"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5"
      />
      <span
        className={cn(
          "flex-1 text-lg",
          todo.completed && "line-through text-gray-500"
        )}
      >
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToggleImportant(todo.id)}
        className={cn(
          "hover:text-yellow-500",
          todo.important && "text-yellow-500"
        )}
      >
        <Star className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}