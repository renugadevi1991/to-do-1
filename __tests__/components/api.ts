export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export const todoAPI = {
  getAllTodos: jest.fn(),
  getTodosByUser: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
};

export const userAPI = {
  getAllUsers: jest.fn(),
};