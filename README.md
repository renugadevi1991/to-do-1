# 📝 Simple Todo List Application# Todo Application



A modern, feature-rich todo list application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. This application provides a comprehensive task management system with user assignment, filtering, search capabilities, and a beautiful dark/light theme.A modern todo application built with Next.js, TypeScript, and Tailwind CSS.



## ✨ Features## Features

- Add, edit, delete todos

### 🎯 **Core Functionality**- Mark todos as complete/incomplete

- ✅ **Create, Read, Update, Delete (CRUD)** todos- Filter todos (all/active/completed)

- ✅ **Mark todos as complete/incomplete** with visual feedback- API integration with JSONPlaceholder

- ✅ **Edit todos inline** with double-click functionality- Responsive design

- ✅ **Delete todos** with confirmation and sound effects

- ✅ **Persistent storage** using JSONPlaceholder API## Setup

```bash

### 👥 **User Management**npm install

- 🧑‍💼 **Multi-user support** with real user data from JSONPlaceholdernpm run dev

- 🎯 **Assign todos to specific users** when creating new tasks```

- 👤 **User profiles** with name, username, and email display

- 📊 **User-specific statistics** and todo counts## Tech Stack

- Next.js 13+ (App Router)

### 🔍 **Advanced Filtering & Search**- TypeScript

- 🔎 **Real-time title search** - Filter todos by text content- Tailwind CSS

- 👥 **User-based filtering** - View todos by specific user

- 📋 **Status filtering** - Filter by All, Active, or Completed todos

- 🔄 **Combined filtering** - All filters work together seamlessly

- 📊 **Dynamic statistics** - Real-time counts based on active filters

Mobile responsive
### 🎨 **User Interface & Experience**
- 🌙 **Dark/Light theme toggle** with system preference detection
- 📱 **Fully responsive design** - Works on desktop, tablet, and mobile
- 🎵 **Sound effects** for actions (add, complete, delete)
- ✨ **Smooth animations** and transitions
- 🎯 **Intuitive icons** and visual feedback
- 🏷️ **Status badges** and progress indicators

### 📊 **Statistics & Analytics**
- 📈 **Floating stats panel** showing total, active, and completed todos
- 📊 **Real-time progress bars** with percentage completion
- 🎯 **User-specific statistics** when filtering by user
- 📋 **Filter-aware counters** that update based on current view

### 🚀 **Performance Features**
- ♾️ **Infinite scroll** with lazy loading
- 📄 **Pagination** with configurable items per page
- 🔄 **Optimistic updates** for instant UI feedback
- 💾 **Local caching** with server synchronization
- ⚡ **Fast search** with debounced input

### 🎪 **Enhanced User Experience**
- ✅ **Success/Error notifications** with auto-dismiss
- 🔄 **Loading states** and skeleton screens
- 📜 **Scroll to top** button for long lists
- 🎯 **Keyboard shortcuts** (Enter to save, Escape to cancel)
- 📝 **Form validation** with helpful error messages
- 🔍 **Clear visual hierarchy** and consistent styling

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **State Management**: React hooks (useState, useEffect, useMemo)
- **API**: JSONPlaceholder (https://jsonplaceholder.typicode.com)
- **Icons**: Heroicons (SVG)
- **Sound**: Web Audio API
- **Theme**: CSS custom properties with Tailwind dark mode

## 📁 Project Structure

```
todo-app/
├── 📁 app/                          # Next.js App Router
│   ├── 📄 globals.css              # Global styles and Tailwind imports
│   ├── 📄 layout.tsx               # Root layout with theme support
│   └── 📄 page.tsx                 # Main application page
│
├── 📁 components/                   # Reusable React components
│   ├── 📄 FilterBar.tsx            # Search and filter controls
│   ├── 📄 FloatingStats.tsx        # Statistics display panel
│   ├── 📄 TodoForm.tsx             # Todo creation form
│   ├── 📄 TodoItem.tsx             # Individual todo item
│   ├── 📄 TodoList.tsx             # Todo list container
│   └── 📄 UserSelector.tsx         # User selection dropdown
│
├── 📁 hooks/                       # Custom React hooks
│   └── 📄 useSound.tsx             # Sound effects management
│
├── 📁 utils/                       # Utility functions and API
│   └── 📄 api.ts                   # API calls and data types
│
├── 📁 __tests__/                   # Test files
│   └── 📁 components/              # Component tests
│       ├── 📄 TodoForm.test.tsx
│       ├── 📄 TodoItem.test.tsx
│       └── 📄 TodoList.test.tsx
│
├── 📁 public/                      # Static assets
│   └── 📁 sounds/                  # Sound effect files
│       ├── 🔊 add.mp3
│       ├── 🔊 complete.mp3
│       └── 🔊 delete.mp3
│
├── 📄 package.json                 # Dependencies and scripts
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 next.config.js              # Next.js configuration
└── 📄 README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22.0 or later
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 How to Use

### 🆕 Creating Todos

1. **Select a user** from the "Assign to User" dropdown
2. **Enter todo text** in the input field (3-100 characters)
3. **Click "Add Todo"** or press Enter
4. **Success notification** will appear confirming creation

### 🔍 Filtering & Searching

1. **Search by title**: Type in the search box to filter todos by text
2. **Filter by user**: Select a user to view only their todos
3. **Filter by status**: Choose All, Active, or Completed
4. **Combine filters**: Use multiple filters simultaneously

### ✏️ Managing Todos

- **Complete/Uncomplete**: Click the checkbox next to any todo
- **Edit**: Double-click on todo text to edit inline
- **Delete**: Click the delete button (red trash icon)
- **Save edits**: Press Enter or click outside the input
- **Cancel edits**: Press Escape

### 🎨 Theme & Settings

- **Toggle theme**: Click the sun/moon icon in the top-right corner
- **Auto theme**: System theme preference is detected automatically
- **Sound effects**: Enabled by default, plays on todo actions

### 📊 Viewing Statistics

- **Floating panel**: Shows total, active, and completed counts
- **Filter-aware**: Statistics update based on current filters
- **User-specific**: When filtering by user, shows their stats
- **Progress bar**: Visual completion percentage

## 🎯 Key Components Explained

### 📄 `app/page.tsx` - Main Application
- **State management** for todos, users, and filters
- **API integration** with JSONPlaceholder
- **Infinite scroll** and pagination logic
- **Theme management** and local storage

### 📝 `components/TodoForm.tsx` - Todo Creation
- **User assignment** dropdown with validation
- **Form validation** with error handling
- **Success/error notifications** with auto-dismiss
- **Character count** and input validation

### 🔍 `components/FilterBar.tsx` - Search & Filter
- **Real-time search** with debounced input
- **Multi-criteria filtering** (title, user, status)
- **Statistics display** with progress indicators
- **Clear completed** functionality

### 📋 `components/TodoList.tsx` - Todo Display
- **Optimized rendering** with conditional loading
- **Empty states** for different filter combinations
- **Loading skeletons** during data fetch
- **Infinite scroll** integration

### 📊 `components/FloatingStats.tsx` - Statistics Panel
- **Real-time statistics** calculation
- **User-specific** and overall metrics
- **Visual progress bars** with animations
- **Responsive positioning**

### 🔧 `utils/api.ts` - API Management
- **JSONPlaceholder integration** for users and todos
- **Error handling** and retry logic
- **TypeScript interfaces** for type safety
- **CRUD operations** with optimistic updates

## 🎨 Styling & Design

### 🎨 **Design System**
- **Color Palette**: Blue primary, gray neutrals, semantic colors
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered elevation system

### 🌙 **Dark Mode Support**
- **Automatic detection** of system preference
- **Manual toggle** with persistent storage
- **Consistent theming** across all components
- **Proper contrast ratios** for accessibility

### 📱 **Responsive Design**
- **Mobile-first** approach with progressive enhancement
- **Flexible grid** layouts with CSS Grid and Flexbox
- **Touch-friendly** interactive elements
- **Adaptive typography** and spacing

## 🔧 Configuration

### 🎵 **Sound Effects**
Sound files should be placed in `public/sounds`:
- `add.mp3` - Played when creating todos
- `complete.mp3` - Played when completing todos
- `delete.mp3` - Played when deleting todos

### 🎨 **Theme Customization**
Modify `tailwind.config.js` to customize:
- Colors and color schemes
- Font families and sizes
- Spacing and sizing scales
- Animation and transition timings

### ⚙️ **API Configuration**
Update `utils/api.ts` to configure:
- API endpoints and base URLs
- Request timeout and retry logic
- Error handling strategies
- Data transformation logic

## 🚀 Performance Features

### ⚡ **Optimization Techniques**
- **useMemo** for expensive calculations
- **useCallback** for stable function references
- **Debounced search** to reduce API calls
- **Optimistic updates** for instant feedback

### 📊 **Loading Strategies**
- **Skeleton screens** during initial load
- **Infinite scroll** for large datasets
- **Progressive loading** with pagination
- **Background sync** for offline support

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 🧪 **Test Coverage**
- **Unit tests** for individual components
- **Integration tests** for component interactions
- **API mocking** for reliable testing
- **Accessibility tests** for WCAG compliance

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### 📋 **Development Guidelines**
- Follow **TypeScript** best practices
- Use **Tailwind CSS** for styling
- Write **comprehensive tests** for new features
- Maintain **consistent code formatting**
- Update **documentation** for new features

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **JSONPlaceholder** for providing free testing APIs
- **Heroicons** for beautiful SVG icons
- **React** team for the component library

## 📞 Support

If you have any questions or need help with setup, please:

1. **Check the documentation** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Contact the maintainers** for urgent matters

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**