import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import * as config from '../config.js';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb'

// Mongoose DB
let models = {};
// import _account from '../models/account.js'
// models.account = _account
// import _characters from '../models/characters.js'
// models.characters = _characters
// import _video from '../models/video.js'
// models.video = _video

export const login = async function(req, res) {
    console.log('Called')
    return res.status(200).send({data: "Hello"})
}

// TODO: Prompt login when coming to the page
// TODO: Add logout, password reset, and get calls for user