import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TaskList = ({ adminView = false }) => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await api.get('/tasks');
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            }
        };
        fetchTasks();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    const toggleComplete = async (task) => {
        try {
             // Toggle locally first for UI snap
             const updatedStatus = !task.isCompleted;
             const updatedTask = { ...task, isCompleted: updatedStatus };
             
             // Update state immediately
             setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));

             // Send to server (we need to send title/desc too as my backend update might require them or it uses previous? 
             // My backend: task.title = req.body.title || task.title. 
             // So I can just send isCompleted.
             await api.put(`/tasks/${task._id}`, { isCompleted: updatedStatus });
        } catch (error) {
             console.error('Failed to update', error);
             // Revert on error if needed
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>{adminView ? 'All Users Tasks' : 'My Tasks'}</h2>
                <Link to="/tasks/new" className="btn btn-primary">Add New Task</Link>
            </div>

            <div className="task-list">
                {tasks.map(task => (
                    <div key={task._id} className="task-card">
                        <div className="task-header">
                            <h3 className="task-title" style={{ textDecoration: task.isCompleted ? 'line-through' : 'none', color: task.isCompleted ? '#94a3b8' : 'inherit' }}>
                                {task.title}
                            </h3>
                            <button
                                onClick={() => toggleComplete(task)}
                                className={`task-status ${task.isCompleted ? 'completed' : ''}`}
                            >
                                {task.isCompleted ? 'Completed' : 'Pending'}
                            </button>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{task.description}</p>
                        
                        {/* Display User info if Admin view */}
                        {(adminView || (user.role === 'admin' && task.user && task.user._id !== user._id)) && task.user && (
                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                                <strong>User:</strong> {task.user.username} ({task.user.email})
                            </div>
                        )}

                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                           <div>
                               {task.category && <span className="badge" style={{background: '#e2e8f0'}}>{task.category.name}</span>}
                           </div>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                               <Link to={`/tasks/edit/${task._id}`} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#f1f5f9' }}>Edit</Link>
                               <button onClick={() => handleDelete(task._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                           </div>
                       </div>
                    </div>
                ))}
                {tasks.length === 0 && <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#64748b'}}>No tasks found. Create one!</p>}
            </div>
        </div>
    );
};

export default TaskList;
