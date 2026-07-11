const express = require('express');
const GraphService = require('./graphService');

function createApp(graph = new GraphService()) {
  const app = express();
  app.use(express.json());
  const run = (handler) => (req, res) => {
    try { handler(req, res); }
    catch (error) {
      const status = error.message === 'User not found' ? 404 : error.message === 'User already exists' ? 409 : 400;
      res.status(status).json({ error: error.message });
    }
  };

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.post('/api/users', run((req, res) => res.status(201).json(graph.createUser(req.body))));
  app.post('/api/users/:userId/follow/:targetId', run((req, res) => res.status(201).json(graph.follow(req.params.userId, req.params.targetId))));
  app.delete('/api/users/:userId/follow/:targetId', run((req, res) => { graph.unfollow(req.params.userId, req.params.targetId); res.status(204).send(); }));
  app.get('/api/users/:userId/following', run((req, res) => res.json(graph.getFollowing(req.params.userId))));
  app.get('/api/users/:userId/followers', run((req, res) => res.json(graph.getFollowers(req.params.userId))));
  app.get('/api/users/:userId/mutuals', run((req, res) => res.json(graph.getMutualConnections(req.params.userId))));
  app.get('/api/users/:userId/suggestions', run((req, res) => res.json(graph.suggestUsers(req.params.userId))));
  return app;
}

module.exports = createApp;
