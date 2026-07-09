import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './config/database';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Team from './models/Team';
import User from './models/User';
import Workout from './models/Workout';

dotenv.config();

const app = express();
const PORT = 8000;

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.disable('x-powered-by');

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'OctoFit Tracker backend is running',
    baseUrl,
    port: PORT,
    mongodb: 'mongodb://localhost:27017/octofit_db'
  });
});

app.get('/api/users/', async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();

  res.status(200).json({
    resource: 'users',
    count: users.length,
    items: users,
    baseUrl
  });
});

app.get('/api/teams/', async (_req, res) => {
  const teams = await Team.find()
    .populate('captain', 'username fullName')
    .populate('members', 'username fullName')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    resource: 'teams',
    count: teams.length,
    items: teams,
    baseUrl
  });
});

app.get('/api/activities/', async (_req, res) => {
  const activities = await Activity.find()
    .populate('user', 'username fullName')
    .sort({ performedAt: -1 })
    .lean();

  res.status(200).json({
    resource: 'activities',
    count: activities.length,
    items: activities,
    baseUrl
  });
});

app.get('/api/leaderboard/', async (_req, res) => {
  const leaderboard = await Leaderboard.find()
    .populate('user', 'username fullName')
    .sort({ rank: 1 })
    .lean();

  res.status(200).json({
    resource: 'leaderboard',
    count: leaderboard.length,
    items: leaderboard,
    baseUrl
  });
});

app.get('/api/workouts/', async (_req, res) => {
  const workouts = await Workout.find().sort({ createdAt: -1 }).lean();

  res.status(200).json({
    resource: 'workouts',
    count: workouts.length,
    items: workouts,
    baseUrl
  });
});

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`OctoFit backend listening on ${baseUrl}`);
  });
}

void startServer();
