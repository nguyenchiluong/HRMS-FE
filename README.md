# HRMS-FE# React + TypeScript + Vite



Human Resources Management System - FrontendThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



A modern, responsive HR management system built with React, TypeScript, Vite, Tailwind CSS, Shadcn UI, and Zustand.Currently, two official plugins are available:



## 🚀 Features- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Dashboard**: Overview of organization statistics and recent activities

- **Employee Management**: View, add, edit, and delete employee records## React Compiler

- **State Management**: Zustand for efficient and simple state management

- **Modern UI**: Beautiful components from Shadcn UI with Tailwind CSSThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Persistent Storage**: Local storage integration for data persistence

- **Authentication**: Login/logout functionality with protected routes## Expanding the ESLint configuration

- **Responsive Design**: Mobile-friendly interface

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

## 🛠️ Tech Stack

```js

- **React 18** - UI libraryexport default defineConfig([

- **TypeScript** - Type safety  globalIgnores(['dist']),

- **Vite** - Fast build tool and dev server  {

- **Tailwind CSS** - Utility-first CSS framework    files: ['**/*.{ts,tsx}'],

- **Shadcn UI** - High-quality UI components    extends: [

- **Zustand** - State management      // Other configs...

- **React Router** - Client-side routing

- **Lucide React** - Beautiful icons      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

## 📦 Installation      // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

```bash      // Optionally, add this for stylistic rules

# Install dependencies      tseslint.configs.stylisticTypeChecked,

npm install

```      // Other configs...

    ],

## 🚀 Usage    languageOptions: {

      parserOptions: {

```bash        project: ['./tsconfig.node.json', './tsconfig.app.json'],

# Run the development server        tsconfigRootDir: import.meta.dirname,

npm run dev      },

      // other options...

# Build for production    },

npm run build  },

])

# Preview production build```

npm run preview

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

# Run ESLint

npm run lint```js

```// eslint.config.js

import reactX from 'eslint-plugin-react-x'

## 📁 Project Structureimport reactDom from 'eslint-plugin-react-dom'



```export default defineConfig([

src/  globalIgnores(['dist']),

├── components/       # Reusable components  {

│   ├── ui/          # Shadcn UI components    files: ['**/*.{ts,tsx}'],

│   └── Layout.tsx   # Main layout with navigation    extends: [

├── pages/           # Page components      // Other configs...

│   ├── Dashboard.tsx      // Enable lint rules for React

│   ├── Employees.tsx      reactX.configs['recommended-typescript'],

│   ├── AddEmployee.tsx      // Enable lint rules for React DOM

│   └── Login.tsx      reactDom.configs.recommended,

├── store/           # Zustand stores    ],

│   └── useStore.ts  # Auth and Employee stores    languageOptions: {

├── lib/             # Utility functions      parserOptions: {

│   └── utils.ts        project: ['./tsconfig.node.json', './tsconfig.app.json'],

├── App.tsx          # Main app with routing        tsconfigRootDir: import.meta.dirname,

└── main.tsx         # Entry point      },

```      // other options...

    },

## 🔑 Demo Credentials  },

])

- **Email**: admin@hrms.com```

- **Password**: admin123

## 🎨 Features Overview

### Dashboard
- Employee statistics and metrics
- Department overview with visual progress bars
- Recent activity feed
- Quick insights into organization health

### Employee Management
- View all employees in card layout
- Employee details including:
  - Name, email, position
  - Department and salary
  - Join date and status
- Add new employees with form validation
- Delete employees with confirmation
- Status indicators (active/inactive)

### State Management
- **Auth Store**: Handles user authentication and session
- **Employee Store**: Manages employee data with CRUD operations
- Persistent storage using Zustand middleware

## 🚧 Future Enhancements

- [ ] Edit employee functionality
- [ ] Advanced filtering and search
- [ ] Export to CSV/PDF
- [ ] Employee attendance tracking
- [ ] Leave management
- [ ] Performance reviews
- [ ] Salary management
- [ ] Dark mode toggle

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
