const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/error.middleware');

// In-memory task storage (replace with database in production)
const tasks = new Map();

const createTask = async (req, res, next) => {
  try {
    const {
      title, description, priority, dueDate,
    } = req.body;
    const taskId = uuidv4();

    const task = {
      id: taskId,
      title,
      description,
      priority: priority || 'medium',
      status: 'pending',
      dueDate,
      createdBy: req.user.userId,
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.set(taskId, task);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    let userTasks = Array.from(tasks.values()).filter(
      (task) => task.createdBy === req.user.userId || task.assignedTo === req.user.userId,
    );

    // Filter by status
    if (status) {
      userTasks = userTasks.filter((task) => task.status === status);
    }

    // Filter by priority
    if (priority) {
      userTasks = userTasks.filter((task) => task.priority === priority);
    }

    res.status(200).json({
      success: true,
      count: userTasks.length,
      data: userTasks,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = tasks.get(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check access
    if (task.createdBy !== req.user.userId && task.assignedTo !== req.user.userId) {
      throw new AppError('Access denied', 403);
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = tasks.get(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check access
    if (task.createdBy !== req.user.userId) {
      throw new AppError('Only task creator can update', 403);
    }

    const updates = req.body;
    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    tasks.set(id, updatedTask);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = tasks.get(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check access
    if (task.createdBy !== req.user.userId) {
      throw new AppError('Only task creator can delete', 403);
    }

    tasks.delete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;
    const task = tasks.get(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check access
    if (task.createdBy !== req.user.userId) {
      throw new AppError('Only task creator can assign', 403);
    }

    task.assignedTo = assignedTo;
    task.updatedAt = new Date().toISOString();
    tasks.set(id, task);

    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  tasks, // Export for testing
};
