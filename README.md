# Todo Application

## Short Description
A simple and efficient application to manage your daily tasks. This project is built with React and Vite, focusing on modern web development practices including custom hooks and component-based architecture.

## Features
- Add new tasks to your todo list.
- View all your current tasks.
- Mark tasks as completed.
- Delete tasks from the list.
- Loading indicators for asynchronous operations.
- User-friendly notifications for actions.

## Technologies Used
- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool and development server.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Axios:** A promise-based HTTP client for making API requests.
- **SweetAlert2:** A library for beautiful and customizable alerts.
- **Vitest:** A blazing fast unit test framework powered by Vite.
- **ESLint:** A tool for identifying and reporting on patterns in JavaScript.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v18.x or later recommended)
- npm (comes with Node.js)

## Installation
To install the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
   (Replace `<repository-url>` with the actual URL of this repository)

2. Navigate to the project directory:
   ```bash
   cd <project-directory-name>
   ```
   (Replace `<project-directory-name>` with the name of the directory where you cloned the repository)

3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Project (Development)
To run the project in development mode with hot reloading:

```bash
npm run dev
```
This will start the Vite development server, typically available at `http://localhost:5173`.

## Building for Production
To build the project for production:

```bash
npm run build
```
This command will generate a `dist` folder in the project root with the optimized static assets. You can preview the production build locally using `npm run preview`.

## Running Tests
This project uses Vitest for unit testing. You can run tests using the following commands:

- To run all tests once:
  ```bash
  npm test
  ```

- To run tests in watch mode (re-runs on file changes):
  ```bash
  npm run test:watch
  ```

- To run tests with a UI (provides a graphical interface for test results):
  ```bash
  npm run test:ui
  ```

Coverage reports are generated in the `coverage/` directory after running tests.

## Linting
This project uses ESLint to ensure code quality and consistency. To run the linter:

```bash
npm run lint
```
This command will check your code for linting errors and warnings based on the configured rules.

## Project Structure
The main application code is located in the `src/new/` directory. This includes:
- `components/`: React components for the UI.
- `hooks/`: Custom React hooks for business logic and API interactions.
- `hoc/`: Higher-Order Components.
- `App.jsx`: The main application component.
- `main.jsx`: The entry point of the application.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
(You can add more detailed contribution guidelines here, such as coding standards, branch naming conventions, etc.)
