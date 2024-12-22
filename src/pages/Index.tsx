import { TodoProvider } from "@/context/TodoContext";
import { TodoList } from "@/components/TodoList";

const Index = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-2xl">
          <h1 className="text-4xl font-bold text-center mb-8">Todo Next</h1>
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  );
};

export default Index;