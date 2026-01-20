const request = require('supertest');
const app = require('../src/server');
const { users } = require('../src/controllers/auth.controller');
const { tasks } = require('../src/controllers/task.controller');

describe('Task API', () => {
  let token;
  let userId;

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
    userId = response.body.data.userId;
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Task');
      expect(response.body.data.status).toBe('pending');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
        });

      expect(response.status).toBe(401);
    });

    it('should validate title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Test Description',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/tasks', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task 1',
          priority: 'high',
          status: 'pending',
        });

      const task2Response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task 2',
          priority: 'low',
        });
      
      // Update task 2 to completed status
      await request(app)
        .put(`/api/v1/tasks/${task2Response.body.data.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'completed',
        });
    });

    it('should get all user tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?status=completed')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const completedTasks = response.body.data.filter(t => t.status === 'completed');
      expect(completedTasks.length).toBeGreaterThan(0);
    });

    it('should filter by priority', async () => {
      const response = await request(app)
        .get('/api/v1/tasks?priority=high')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.every(t => t.priority === 'high')).toBe(true);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task to Get',
        });

      taskId = response.body.data.id;
    });

    it('should get task by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Task to Get');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task to Update',
        });

      taskId = response.body.data.id;
    });

    it('should update task', async () => {
      const response = await request(app)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'completed',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('completed');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'completed',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task to Delete',
        });

      taskId = response.body.data.id;
    });

    it('should delete task', async () => {
      const response = await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/tasks/:id/assign', () => {
    let taskId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Task to Assign',
        });

      taskId = response.body.data.id;
    });

    it('should assign task to user', async () => {
      const response = await request(app)
        .post(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          assignedTo: 'another-user-id',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.assignedTo).toBe('another-user-id');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .post('/api/v1/tasks/00000000-0000-0000-0000-000000000000/assign')
        .set('Authorization', `Bearer ${token}`)
        .send({
          assignedTo: 'another-user-id',
        });

      expect(response.status).toBe(404);
    });
  });
});
