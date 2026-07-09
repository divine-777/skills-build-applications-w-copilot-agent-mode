import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const users = await User.insertMany([
      {
        username: 'mariafit',
        email: 'maria@octofit.test',
        fullName: 'Maria Santos',
        age: 29,
        fitnessLevel: 'advanced'
      },
      {
        username: 'carlosrun',
        email: 'carlos@octofit.test',
        fullName: 'Carlos Rivera',
        age: 34,
        fitnessLevel: 'intermediate'
      },
      {
        username: 'elenaactive',
        email: 'elena@octofit.test',
        fullName: 'Elena Gomez',
        age: 26,
        fitnessLevel: 'beginner'
      }
    ]);

    await Team.insertMany([
      {
        name: 'Mountain Sprinters',
        description: 'Trail runners focused on interval and endurance blocks.',
        captain: users[0]._id,
        members: [users[0]._id, users[1]._id]
      },
      {
        name: 'City Strength Crew',
        description: 'After-work lifting sessions with mobility cool-downs.',
        captain: users[1]._id,
        members: [users[1]._id, users[2]._id]
      }
    ]);

    await Activity.insertMany([
      {
        user: users[0]._id,
        activityType: 'run',
        durationMinutes: 48,
        caloriesBurned: 520,
        performedAt: new Date('2026-07-01T06:30:00.000Z')
      },
      {
        user: users[1]._id,
        activityType: 'strength',
        durationMinutes: 60,
        caloriesBurned: 460,
        performedAt: new Date('2026-07-02T18:10:00.000Z')
      },
      {
        user: users[2]._id,
        activityType: 'yoga',
        durationMinutes: 35,
        caloriesBurned: 170,
        performedAt: new Date('2026-07-03T07:20:00.000Z')
      },
      {
        user: users[0]._id,
        activityType: 'hiit',
        durationMinutes: 30,
        caloriesBurned: 390,
        performedAt: new Date('2026-07-04T19:00:00.000Z')
      }
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, points: 1820, rank: 1 },
      { user: users[1]._id, points: 1640, rank: 2 },
      { user: users[2]._id, points: 1210, rank: 3 }
    ]);

    await Workout.insertMany([
      {
        title: 'Lunchtime Fat Burn Circuit',
        goal: 'weight-loss',
        difficulty: 'intermediate',
        estimatedMinutes: 35,
        exercises: ['Jump squats', 'Mountain climbers', 'Push-ups', 'Burpees']
      },
      {
        title: 'Progressive Lower Body Builder',
        goal: 'muscle-gain',
        difficulty: 'advanced',
        estimatedMinutes: 55,
        exercises: ['Back squat', 'Romanian deadlift', 'Walking lunges', 'Hip thrust']
      },
      {
        title: 'Beginner Mobility Flow',
        goal: 'mobility',
        difficulty: 'beginner',
        estimatedMinutes: 25,
        exercises: ['Cat-cow', 'World\'s greatest stretch', 'Hip openers', 'Thoracic rotations']
      }
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
