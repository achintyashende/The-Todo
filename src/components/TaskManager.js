// src/components/TaskManager.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask } from '../redux/taskSlice';

const TaskManager = () => {
    const tasks = useSelector(state => state.tasks);
    const dispatch = useDispatch();

    useEffect(() => {
        // Add a task for testing
        dispatch(addTask({
            
        }));
    }, [dispatch]);

    return (
        <div>
            <h1>Task Dashboard</h1>
            <pre>{JSON.stringify(tasks, null, 2)}</pre>
        </div>
    );
};

export default TaskManager;
