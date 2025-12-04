//get all todos

import { api } from "./api";


interface GetTodosRequest {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
}

export enum Status {
    PENDING = 'pending',
    DONE = 'done',
    CANCELLED = 'cancelled'
  }

  export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
  }
  
export interface Todo {
    id: string;
    title: string;
    priority: Priority;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
export interface GetTodosResponse {
    success: boolean;
    message: string;
    data: Todo[];
}

interface CreateTodoRequest {
    title: string;
    priority?: Priority;
    status?: Status;
}
interface CreateTodoResponse {
    success: boolean;
    message: string;
    data: Todo;}


export const getTodos = async (query: string) => {
    try {
        const response = await api.get(`/todos?${query}`);
        return response.data;
    } catch (error) {
        console.error('Error getting todos:', error);
        throw error;
    }
}

export const createTodo = async (request: CreateTodoRequest) => {
    try {
        const response = await api.post('/todos', request);
        return response.data;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
}




