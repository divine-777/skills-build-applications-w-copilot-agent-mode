import { Schema, model, type InferSchemaType } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    goal: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'endurance', 'mobility'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    estimatedMinutes: { type: Number, required: true, min: 10 },
    exercises: [{ type: String, required: true }]
  },
  { timestamps: true }
);

export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;

const Workout = model('Workout', workoutSchema);

export default Workout;
