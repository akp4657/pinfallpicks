import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import * as config from '../config.js';
import * as bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// TODO: Display the user's wrestlers in a table along with their points
// This will be default to the user's landing page, but linking through the leaderboard
// allows others to view that table


// TODO: Show and update users based on the Google Sheet
export const updatePoints = async function(req, res) {
    // Check if the username isn't taken
}
// TODO: Show all of the user's teams in a leaderboard style