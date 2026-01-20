const { tasks } = require('./task.controller');

const getTaskStatistics = async (req, res, next) => {
  try {
    const userTasks = Array.from(tasks.values()).filter(
      (task) => task.createdBy === req.user.userId || task.assignedTo === req.user.userId,
    );

    const stats = {
      total: userTasks.length,
      byStatus: {
        pending: userTasks.filter((t) => t.status === 'pending').length,
        inProgress: userTasks.filter((t) => t.status === 'in-progress').length,
        completed: userTasks.filter((t) => t.status === 'completed').length,
      },
      byPriority: {
        low: userTasks.filter((t) => t.priority === 'low').length,
        medium: userTasks.filter((t) => t.priority === 'medium').length,
        high: userTasks.filter((t) => t.priority === 'high').length,
      },
      created: userTasks.filter((t) => t.createdBy === req.user.userId).length,
      assigned: userTasks.filter((t) => t.assignedTo === req.user.userId).length,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskTrends = async (req, res, next) => {
  try {
    const userTasks = Array.from(tasks.values()).filter(
      (task) => task.createdBy === req.user.userId || task.assignedTo === req.user.userId,
    );

    // Calculate completion rate
    const completedTasks = userTasks.filter((t) => t.status === 'completed').length;
    const completionRate = userTasks.length > 0
      ? ((completedTasks / userTasks.length) * 100).toFixed(2)
      : 0;

    // Overdue tasks
    const now = new Date();
    const overdueTasks = userTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed',
    );

    const trends = {
      completionRate: `${completionRate}%`,
      overdueTasks: overdueTasks.length,
      averagePriority: calculateAveragePriority(userTasks),
      recentActivity: userTasks.slice(-5).reverse(),
    };

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

const calculateAveragePriority = (tasks) => {
  if (tasks.length === 0) return 'N/A';

  const priorityMap = { low: 1, medium: 2, high: 3 };
  const sum = tasks.reduce((acc, task) => acc + (priorityMap[task.priority] || 2), 0);
  const avg = sum / tasks.length;

  if (avg <= 1.5) return 'Low';
  if (avg <= 2.5) return 'Medium';
  return 'High';
};

module.exports = {
  getTaskStatistics,
  getTaskTrends,
};
