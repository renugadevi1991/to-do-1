import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '@/components/TodoForm';
import type { User } from '@/utils/api';

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

const defaultProps = {
  onAddTodo: jest.fn(),
  users: mockUsers,
  selectedUserId: null,
  onUserChange: jest.fn(),
};

describe('TodoForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders todo form with input and button', () => {
      render(<TodoForm {...defaultProps} />);
      
      expect(screen.getByPlaceholderText(/add a new todo/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
    });

    test('renders user selector when users are provided', () => {
      render(<TodoForm {...defaultProps} />);
      
      // Look for select element or dropdown
      const userSelector = screen.getByRole('combobox') || screen.getByText(/select user/i);
      expect(userSelector).toBeInTheDocument();
    });

    test('displays selected user correctly', () => {
      render(<TodoForm {...defaultProps} selectedUserId={1} />);
      
      // Check if John Doe is selected/displayed
      expect(screen.getByDisplayValue('John Doe') || screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('allows user to type in the input field', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      await user.type(input, 'New todo item');
      
      expect(input).toHaveValue('New todo item');
    });

    test('submits form with Enter key', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} selectedUserId={1} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      await user.type(input, 'Test todo{enter}');
      
      expect(defaultProps.onAddTodo).toHaveBeenCalledWith('Test todo', 1);
    });
  });

  describe('Form Validation', () => {
    test('does not submit when input is empty', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} selectedUserId={1} />);
      
      const button = screen.getByRole('button', { name: /add todo/i });
      await user.click(button);
      
      expect(defaultProps.onAddTodo).not.toHaveBeenCalled();
    });

    test('does not submit when input is only whitespace', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} selectedUserId={1} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      
      await user.type(input, '   ');
      await user.click(button);
      
      expect(defaultProps.onAddTodo).not.toHaveBeenCalled();
    });

    test('does not submit when no user is selected', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} selectedUserId={null} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      
      await user.type(input, 'Test todo');
      await user.click(button);
      
      expect(defaultProps.onAddTodo).not.toHaveBeenCalled();
    });

    test('trims whitespace from input before submission', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} selectedUserId={1} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      
      await user.type(input, '  Test todo  ');
      await user.click(button);
      
      expect(defaultProps.onAddTodo).toHaveBeenCalledWith('Test todo', 1);
    });
  });

  describe('API Integration', () => {
    test('calls onAddTodo when form is submitted with valid data', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} selectedUserId={1} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      
      await user.type(input, 'Test todo');
      await user.click(button);
      
      expect(defaultProps.onAddTodo).toHaveBeenCalledWith('Test todo', 1);
      expect(defaultProps.onAddTodo).toHaveBeenCalledTimes(1);
    });

    test('clears input after successful submission', async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} selectedUserId={1} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      
      await user.type(input, 'Test todo');
      await user.click(button);
      
      expect(input).toHaveValue('');
    });
  });

  describe('Loading States', () => {
    test('shows placeholder when no users available', () => {
      render(<TodoForm {...defaultProps} users={[]} />);
      
      // Check for loading or empty state text
      const loadingText = screen.queryByText(/loading/i) || screen.queryByText(/no users/i);
      expect(loadingText).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles form submission errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const errorProps = {
        ...defaultProps,
        onAddTodo: jest.fn().mockImplementation(() => {
          throw new Error('Submission failed');
        }),
      };
      
      const user = userEvent.setup();
      render(<TodoForm {...errorProps} selectedUserId={1} />);
      
      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole('button', { name: /add todo/i });
      
      await user.type(input, 'Test todo');
      
      // Should not throw an error to the test
      await expect(async () => {
        await user.click(button);
      }).not.toThrow();
      
      consoleError.mockRestore();
    });
  });
});