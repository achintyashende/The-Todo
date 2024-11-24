// src/redux/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage, if available
const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        return JSON.parse(savedTasks);
    }
    return {
        todo: [],
        inProgress: [],
        done: [],
    };
};

const initialState = loadTasksFromLocalStorage();

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            const { section, task } = action.payload;
            state[section].push(task);
            saveTasksToLocalStorage(state); // Save to localStorage
        },
        moveTask: (state, action) => {
            const { from, to, taskId } = action.payload;

            // Find the task in the source section
            const taskIndex = state[from].findIndex((task) => task.id === taskId);
            const task = state[from].splice(taskIndex, 1)[0]; // Remove task from source section

            // Add task to the destination section
            state[to].push(task);
            saveTasksToLocalStorage(state); // Save to localStorage
        },
        deleteTask: (state, action) => {
            const { id } = action.payload;
            // Remove task from any section where it exists
            Object.keys(state).forEach((section) => {
                const index = state[section].findIndex((task) => task.id === id);
                if (index !== -1) {
                    state[section].splice(index, 1);
                }
            });
            saveTasksToLocalStorage(state); // Save to localStorage
        },
        editTask: (state, action) => {
            const { id, name, description } = action.payload;
            // Find the task and update its properties
            Object.keys(state).forEach((section) => {
                const task = state[section].find((task) => task.id === id);
                if (task) {
                    task.name = name;
                    task.description = description;
                }
            });
            saveTasksToLocalStorage(state); // Save to localStorage
        },
    },
});

// Save state to localStorage
const saveTasksToLocalStorage = (state) => {
    localStorage.setItem('tasks', JSON.stringify(state));
};

export const { addTask, moveTask, deleteTask, editTask } = taskSlice.actions;

export default taskSlice.reducer;
