const request = require('supertest');
const app = require('../src/server');
const { users } = require('../src/controllers/auth.controller');
const { tasks } = require('../src/controllers/task.controller');

describe('Analytics API', () => {
  let token;

  beforeEach(async () => {
    users.clear();
    tasks.clear();

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    token = response.body.data.token;

    // Create sample tasks
    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task 1',
        priority: 'high',
        status: 'completed',
      });

    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task 2',
        priority: 'low',
        status: 'pending',
      });
  });

  describe('GET /api/v1/analytics/statistics', () => {
    it('should get task statistics', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/statistics')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('byStatus');
      expect(response.body.data).toHaveProperty('byPriority');
      expect(response.body.data.total).toBe(2);
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/v1/analytics/statistics');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/analytics/trends', () => {
    it('should get task trends', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/trends')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('completionRate');
      expect(response.body.data).toHaveProperty('overdueTasks');
      expect(response.body.data).toHaveProperty('averagePriority');
    });

    it('should calculate overdue tasks correctly', async () => {
      // Create a task with past due date
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Overdue Task',
          priority: 'high',
          status: 'pending',
          dueDate: '2020-01-01',
        });

      const response = await request(app)
        .get('/api/v1/analytics/trends')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.overdueTasks).toBeGreaterThan(0);
    });
  });
});
