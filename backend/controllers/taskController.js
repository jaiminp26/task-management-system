const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    let tasks;

    if (req.user.role === 'admin') {
        tasks = await Task.find({}).populate('user', 'username email').populate('category', 'name');
    } else {
        tasks = await Task.find({ user: req.user._id }).populate('user', 'username email').populate('category', 'name');
    }

    res.json(tasks);
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, category } = req.body;

    const task = new Task({
        title,
        description,
        user: req.user._id,
        category,
        isCompleted: false,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        // Check user permission
        if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : task.isCompleted;
        task.category = req.body.category || task.category;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
