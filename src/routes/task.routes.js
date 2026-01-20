const express = require('express');
const { body, param } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('dueDate').optional().isISO8601().withMessage('Valid date is required'),
    validate,
  ],
  createTask,
);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks for user
 * @access  Private
 */
router.get('/', getTasks);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get task by ID
 * @access  Private
 */
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Valid task ID is required'), validate],
  getTaskById,
);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid task ID is required'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority'),
    validate,
  ],
  updateTask,
);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Valid task ID is required'), validate],
  deleteTask,
);

/**
 * @route   POST /api/v1/tasks/:id/assign
 * @desc    Assign task to a user
 * @access  Private
 */
router.post(
  '/:id/assign',
  [
    param('id').isUUID().withMessage('Valid task ID is required'),
    body('assignedTo').notEmpty().withMessage('User ID is required'),
    validate,
  ],
  assignTask,
);

module.exports = router;
