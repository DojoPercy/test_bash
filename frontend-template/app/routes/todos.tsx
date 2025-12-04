'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "~/components/layout/authenticated-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getTodos, type GetTodosResponse, type Todo } from "~/todos_api";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string | undefined>('pending');
  const [priority, setPriority] = useState<string | undefined>(undefined);
  useEffect(()=> {
    setLoading(true);
    try {
      getTodos(convertQueryParams()).then((response: GetTodosResponse) => {
        setTodos(response.data);
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const convertQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    return queryParams.toString();
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Todos</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <Select
              onValueChange={(value) => setStatus(value)}
              value={status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
                <SelectContent >
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </SelectTrigger>
            </Select>
          </div>
        </div>
      <div className="mt-4">
      <table className="w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              
              todos.map((todo) => {
                return (
                  <tr key={todo.id}>
                    <td>{todo.title}</td>
                    <td>{todo.priority}</td>
                    <td>{todo.status}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      </div>
    </AuthenticatedLayout>
  );
}
