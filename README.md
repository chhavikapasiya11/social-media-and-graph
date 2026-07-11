# Social Media Graph API

A REST backend that models social-media follow relationships as a directed graph. It provides graph operations for following users, finding mutuals, and generating second-degree connection suggestions.

## Internship details

- **Intern ID:** CITS3714
- **Role:** Backend Developer Intern

## Features

- Create users
- Follow and unfollow users
- Retrieve followers and following lists
- Find mutual connections
- Suggest users based on friends-of-friends, ranked by mutual connection count

## Run locally

```bash
npm install
npm start
```

## Test

```bash
npm test
```

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/users` | Create a user |
| POST | `/api/users/:userId/follow/:targetId` | Follow a user |
| DELETE | `/api/users/:userId/follow/:targetId` | Unfollow a user |
| GET | `/api/users/:userId/following` | List followed users |
| GET | `/api/users/:userId/followers` | List followers |
| GET | `/api/users/:userId/mutuals` | List mutual connections |
| GET | `/api/users/:userId/suggestions` | Get recommended users |

## Example

Create a user:

```json
POST /api/users
{ "id": "user-1", "name": "Chhavi" }
```

The service uses in-memory data to keep the graph logic simple. For production, replace it with a graph database or relational database.
