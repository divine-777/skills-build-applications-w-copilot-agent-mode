"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const Activity_1 = __importDefault(require("./models/Activity"));
const Leaderboard_1 = __importDefault(require("./models/Leaderboard"));
const Team_1 = __importDefault(require("./models/Team"));
const User_1 = __importDefault(require("./models/User"));
const Workout_1 = __importDefault(require("./models/Workout"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use(express_1.default.json());
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
    const users = await User_1.default.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
        resource: 'users',
        count: users.length,
        items: users,
        baseUrl
    });
});
app.get('/api/teams/', async (_req, res) => {
    const teams = await Team_1.default.find()
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
    const activities = await Activity_1.default.find()
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
    const leaderboard = await Leaderboard_1.default.find()
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
    const workouts = await Workout_1.default.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
        resource: 'workouts',
        count: workouts.length,
        items: workouts,
        baseUrl
    });
});
async function startServer() {
    await (0, database_1.connectDatabase)();
    app.listen(PORT, () => {
        console.log(`OctoFit backend listening on ${baseUrl}`);
    });
}
void startServer();
