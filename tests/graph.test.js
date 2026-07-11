const request = require('supertest');
const createApp = require('../src/app');

describe('Social media graph API', () => {
  const app = createApp();

  beforeAll(async () => {
    for (const user of [{ id: 'a', name: 'Asha' }, { id: 'b', name: 'Bharat' }, { id: 'c', name: 'Charu' }]) {
      await request(app).post('/api/users').send(user).expect(201);
    }
    await request(app).post('/api/users/a/follow/b').expect(201);
    await request(app).post('/api/users/b/follow/c').expect(201);
  });

  test('returns second-degree connection suggestions', async () => {
    const response = await request(app).get('/api/users/a/suggestions').expect(200);
    expect(response.body).toEqual([{ id: 'c', name: 'Charu', mutualConnectionCount: 1 }]);
  });

  test('returns followers and supports unfollowing', async () => {
    const followers = await request(app).get('/api/users/b/followers').expect(200);
    expect(followers.body).toEqual([{ id: 'a', name: 'Asha' }]);
    await request(app).delete('/api/users/a/follow/b').expect(204);
  });
});
