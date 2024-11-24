import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, moveTask, deleteTask, editTask } from '../redux/taskSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Dashboard.css';

const Dashboard = () => {
    const dispatch = useDispatch();

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('medium');
    const [editMode, setEditMode] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPriority, setEditPriority] = useState('medium');
    const [filterCriteria, setFilterCriteria] = useState('all'); // Simplified filter for category

    const tasks = useSelector((state) => state.tasks);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (taskName && taskDescription) {
            const newTask = {
                id: Date.now(),
                name: taskName,
                description: taskDescription,
                priority: taskPriority,
            };
            dispatch(addTask({ section: 'todo', task: newTask }));
            setTaskName('');
            setTaskDescription('');
            setTaskPriority('medium');
        }
    };

    const handleDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const taskId = result.draggableId;
        const fromSection = source.droppableId;
        const toSection = destination.droppableId;

        dispatch(moveTask({ from: fromSection, to: toSection, taskId }));
    };

    const handleEdit = (task) => {
        setEditMode(task.id);
        setEditName(task.name);
        setEditDescription(task.description);
        setEditPriority(task.priority);
    };

    const handleSaveEdit = () => {
        dispatch(editTask({ id: editMode, name: editName, description: editDescription, priority: editPriority }));
        setEditMode(null);
        setEditName('');
        setEditDescription('');
        setEditPriority('medium');
    };

    const handleDelete = (taskId) => {
        dispatch(deleteTask({ id: taskId }));
    };

    const renderFilteredTasks = (section) => {
        if (filterCriteria === 'all') {
            return tasks[section];
        }
        return tasks[section].filter((task) => task.priority === filterCriteria);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="dashboard">
                <h2>Add a Task</h2>
                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Task Description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <button type="submit">Add Task</button>
                </form>

                <div className="filters">
                    <h3>Filter by Priority</h3>
                    <select
                        value={filterCriteria}
                        onChange={(e) => setFilterCriteria(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {['todo', 'inProgress', 'done'].map((section) => (
                    <Droppable key={section} droppableId={section}>
                        {(provided) => (
                            <div
                                className="section"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2>{section.replace(/([A-Z])/g, ' $1')}</h2>
                                <ul>
                                    {renderFilteredTasks(section).map((task, index) => (
                                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <strong>{task.name}</strong> - {task.description}
                                                    <span className={`priority ${task.priority}`}>({task.priority})</span>
                                                    <button onClick={() => handleEdit(task)}>Edit</button>
                                                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            </div>
                        )}
                    </Droppable>
                ))}

                {editMode && (
                    <div className="edit-modal">
                        <h3>Edit Task</h3>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Edit task name"
                        />
                        <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Edit task description"
                        />
                        <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                        >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <button onClick={handleSaveEdit}>Save Changes</button>
                        <button onClick={() => setEditMode(null)}>Cancel</button>
                    </div>
                )}
            </div>
        </DragDropContext>
    );
};

export default Dashboard;
