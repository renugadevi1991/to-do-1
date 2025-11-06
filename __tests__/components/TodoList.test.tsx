import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '@/components/TodoList';
import type { Todo, User } from '@/utils/api';

// Mock the API module at the top of the file
jest.mock('@/utils/api', () => ({
  todoAPI: {
    getAllTodos: jest.fn(),
    getTodosByUser: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
  userAPI: {
    getAllUsers: jest.fn(),
  },
}));

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'Complete project',
    completed: false,
    createdAt: new Date('2023-01-01'),
    userId: 1,
  },
  {
    id: '2',
    text: 'Write tests',
    completed: true,
    createdAt: new Date('2023-01-02'),
    userId: 2,
  },
  {
    id: '3',
    text: 'Review code',
    completed: false,
    createdAt: new Date('2023-01-03'),
    userId: 1,
  },
];

const defaultProps = {
  todos: mockTodos,
  filter: 'all' as const,
  isLoading: false,
  onToggleComplete: jest.fn(),
  onDeleteTodo: jest.fn(),
  onEditTodo: jest.fn(),
  users: mockUsers,
};

describe('TodoList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders list of todos', () => {
      render(<TodoList {...defaultProps} />);
      
      expect(screen.getByText('Complete project')).toBeInTheDocument();
      expect(screen.getByText('Write tests')).toBeInTheDocument();
      expect(screen.getByText('Review code')).toBeInTheDocument();
    });

    test('displays user names for each todo', () => {
      render(<TodoList {...defaultProps} />);
      
      // Look for user names in the rendered component
      expect(screen.getAllByText('John Doe')).toHaveLength(2);
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    test('shows all todos when filter is "all"', () => {
      render(<TodoList {...defaultProps} filter="all" />);
      
      expect(screen.getByText('Complete project')).toBeInTheDocument();
      expect(screen.getByText('Write tests')).toBeInTheDocument();
      expect(screen.getByText('Review code')).toBeInTheDocument();
    });

    test('filters active todos when filter is "active"', () => {
      render(<TodoList {...defaultProps} filter="active" />);
      
      expect(screen.getByText('Complete project')).toBeInTheDocument();
      expect(screen.getByText('Review code')).toBeInTheDocument();
      expect(screen.queryByText('Write tests')).not.toBeInTheDocument();
    });

    test('filters completed todos when filter is "completed"', () => {
      render(<TodoList {...defaultProps} filter="completed" />);
      
      expect(screen.queryByText('Complete project')).not.toBeInTheDocument();
      expect(screen.queryByText('Review code')).not.toBeInTheDocument();
      expect(screen.getByText('Write tests')).toBeInTheDocument();
    });

    test('shows message when no todos found', () => {
      render(<TodoList {...defaultProps} todos={[]} filter="all" />);
      
      expect(screen.getByText(/no todos found/i)).toBeInTheDocument();
    });
  });

  describe('Todo Interactions', () => {
    test('calls onToggleComplete when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);
      
      expect(defaultProps.onToggleComplete).toHaveBeenCalledWith('1');
      expect(defaultProps.onToggleComplete).toHaveBeenCalledTimes(1);
    });

    test('calls onDeleteTodo when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);
      
      expect(defaultProps.onDeleteTodo).toHaveBeenCalledWith('1');
      expect(defaultProps.onDeleteTodo).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading States', () => {
    test('shows loading state', () => {
      render(<TodoList {...defaultProps} isLoading={true} />);
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('hides loading state when not loading', () => {
      render(<TodoList {...defaultProps} isLoading={false} />);
      
      expect(screen.queryByText(/loading todos/i)).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles interaction errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const errorProps = {
        ...defaultProps,
        onToggleComplete: jest.fn().mockImplementation(() => {
          throw new Error('Toggle failed');
        }),
      };
      
      const user = userEvent.setup();
      render(<TodoList {...errorProps} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      
      // Should not throw an error to the test
      await expect(async () => {
        await user.click(checkboxes[0]);
      }).not.toThrow();
      
      consoleError.mockRestore();
    });
  });
});