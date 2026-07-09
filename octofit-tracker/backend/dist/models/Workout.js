"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const Workout = (0, mongoose_1.model)('Workout', workoutSchema);
exports.default = Workout;
