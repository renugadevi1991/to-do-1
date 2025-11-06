const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

export interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

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
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// Transform API todo to our app format
const transformApiTodo = (apiTodo: ApiTodo): Todo => ({
  id: apiTodo.id.toString(),
  text: apiTodo.title,
  completed: apiTodo.completed,
  createdAt: new Date(),
  userId: apiTodo.userId
});

// Transform our app todo to API format
const transformToApiTodo = (todo: Partial<Todo>): Partial<ApiTodo> => ({
  title: todo.text,
  completed: todo.completed,
  userId: todo.userId || 1
});

export const todoAPI = {
  // Fetch all todos
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const apiTodos: ApiTodo[] = await response.json();
      return apiTodos.map(transformApiTodo);
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Fetch todos by user
  async getTodosByUser(userId: number): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user todos');
      const apiTodos: ApiTodo[] = await response.json();
      return apiTodos.map(transformApiTodo);
    } catch (error) {
      console.error('Error fetching user todos:', error);
      throw error;
    }
  },

  // Fetch specific todo
  async getTodo(id: string): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`);
      if (!response.ok) throw new Error('Failed to fetch todo');
      const apiTodo: ApiTodo = await response.json();
      return transformApiTodo(apiTodo);
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  // Create new todo
  async createTodo(text: string, userId: number = 1): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: text,
          completed: false,
          userId
        }),
      });
      if (!response.ok) throw new Error('Failed to create todo');
      const apiTodo: ApiTodo = await response.json();
      return transformApiTodo(apiTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update todo
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(id),
          ...transformToApiTodo(updates)
        }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const apiTodo: ApiTodo = await response.json();
      return transformApiTodo(apiTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete todo
  async deleteTodo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
};

export const userAPI = {
  // Fetch all users
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const users: User[] = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Fetch specific user
  async getUser(id: number): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
};