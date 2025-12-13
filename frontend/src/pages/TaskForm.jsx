import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchCategories();
        if (id) {
            setIsEditing(true);
            fetchTask();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchTask = async () => {
        try {
            const { data } = await api.get('/tasks');
            // Since we don't have a single task endpoint exposed in routes (Actually I missed exposing GET /tasks/:id in routes, let me check backend)
            // Backend routes: router.route('/:id').put(...).delete(...)
            // I missed GET /:id in backend taskRoutes!
            // I should just filter from the list or add the endpoint.
            // Filtering from list is inefficient but works if I only have list endpoint. 
            // Wait, "Task CRUD Operations... APIs: ... GET /api/tasks ... PUT ... DELETE".
            // It didn't explicitly ask for GET /api/tasks/:id.
            // But for editing I need to load data. I can pass state via Link or fetch all and find. 
            // Admin can CRUD any task. If I fetch all tasks, I get them.
            // I'll filter from the list for now to save a backend edit step, or just edit backend quickly.
            // Actually, fetching all tasks just to find one is okay for small apps.
            // But wait, if am editing, I can assume the user came from the list.
            const task = data.find(t => t._id === id);
            if (task) {
                setTitle(task.title);
                setDescription(task.description);
                if (task.category) setCategoryId(task.category._id || task.category);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let finalCategoryId = categoryId;

        // If new category entered, create it first
        if (newCategory) {
            try {
                const { data } = await api.post('/categories', { name: newCategory });
                finalCategoryId = data._id;
            } catch (error) {
                console.error('Failed to create category');
                return;
            }
        }

        const taskData = {
            title,
            description,
            category: finalCategoryId || null,
        };

        try {
            if (isEditing) {
                await api.put(`/tasks/${id}`, taskData);
            } else {
                await api.post('/tasks', taskData);
            }
            navigate('/');
        } catch (error) {
             console.error('Failed to save task', error);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
            <div className="card">
                <h2>{isEditing ? 'Edit Task' : 'Create Task'}</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-control"
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                if (e.target.value) setNewCategory('');
                            }}
                            disabled={!!newCategory}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Or Create New Category</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="New Category Name"
                            value={newCategory}
                            onChange={(e) => {
                                setNewCategory(e.target.value);
                                if (e.target.value) setCategoryId('');
                            }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Update Task' : 'Create Task'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/')} style={{ marginLeft: '1rem' }}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
