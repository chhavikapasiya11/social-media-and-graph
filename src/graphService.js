class GraphService {
  constructor() {
    this.users = new Map();
    this.following = new Map();
  }

  createUser({ id, name }) {
    if (!id || typeof id !== 'string') throw new Error('id is required');
    if (!name || typeof name !== 'string' || !name.trim()) throw new Error('name is required');
    if (this.users.has(id)) throw new Error('User already exists');
    const user = { id, name: name.trim() };
    this.users.set(id, user);
    this.following.set(id, new Set());
    return user;
  }

  getUser(id) {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  follow(userId, targetId) {
    this.getUser(userId);
    this.getUser(targetId);
    if (userId === targetId) throw new Error('Users cannot follow themselves');
    this.following.get(userId).add(targetId);
    return this.relationship(userId, targetId);
  }

  unfollow(userId, targetId) {
    this.getUser(userId);
    this.getUser(targetId);
    if (!this.following.get(userId).delete(targetId)) throw new Error('Follow relationship not found');
  }

  getFollowing(userId) {
    this.getUser(userId);
    return [...this.following.get(userId)].map((id) => this.getUser(id));
  }

  getFollowers(userId) {
    this.getUser(userId);
    return [...this.following.entries()]
      .filter(([, targets]) => targets.has(userId))
      .map(([id]) => this.getUser(id));
  }

  getMutualConnections(userId) {
    const following = new Set(this.getFollowing(userId).map((user) => user.id));
    return this.getFollowers(userId).filter((user) => following.has(user.id));
  }

  suggestUsers(userId) {
    this.getUser(userId);
    const directConnections = this.following.get(userId);
    const scores = new Map();
    for (const connectionId of directConnections) {
      for (const candidateId of this.following.get(connectionId)) {
        if (candidateId !== userId && !directConnections.has(candidateId)) {
          scores.set(candidateId, (scores.get(candidateId) || 0) + 1);
        }
      }
    }
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([id, mutualConnectionCount]) => ({ ...this.getUser(id), mutualConnectionCount }));
  }

  relationship(userId, targetId) {
    return { followerId: userId, followingId: targetId, isFollowing: this.following.get(userId).has(targetId) };
  }
}

module.exports = GraphService;
