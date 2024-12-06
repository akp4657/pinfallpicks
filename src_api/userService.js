import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import * as config from '../config.js';
import * as bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb'
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
import path from 'path'

// Mongoose DB
let models = {};
// import _account from '../models/account.js'
// models.account = _account
// import _characters from '../models/characters.js'
// models.characters = _characters
// import _video from '../models/video.js'
// models.video = _video

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}
// Sign up call
export const addUser = async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    try {
        await authorize();
        return res.status(200).send({
            message: "Logged In"
        });
    } catch(err) {
        console.log(err)
        return res.status(500).send({
            message: "Login Error"
        });
    }
    // Check if the username isn't taken
    // models.user.findOne({
    //     where: {
    //         username: username
    //     }
    // }).then(user_found => {
    //     if (user_found) {
    //         helper.sendResponse(res, 200, false, {
    //             message: 'Username is taken.',
    //         });
    //     } else {
    //         //carry on
    //         //hash password
    //         const salt = bcrypt.genSaltSync(config.pwd_salt_rounds);
    //         var hash = bcrypt.hashSync(password, salt);

    //         //create user
    //         models.staff.create({
    //             username: username,
    //             password: hash,
    //             email: email
    //         }).then(user_created => {
    //             return res.status(200).send({
    //                 user: user_created
    //             });
    //         }).catch(err => {
    //             console.log(err)
    //             return res.status(500).send({
    //                 message: "Contact Admin"
    //             });
    //         });
    //     }
    // }).catch(err => {
    //     console.log(err)
    //     return res.status(500).send({
    //         message: "Contact Admin"
    //     });
    // });
}

// Log in
export const login = async function(req, res) {
    var username = req.body.username.value;
    var password = req.body.password.value;

    if (username && password) {
        models.users.findOne({
            where: {
                username: username
            }
        }).then(user_found => {
            if (user_found) {
                // Adding an additional try..catch for bcrypt compare
                var dcrypt;
                try {
                    dcrypt = bcrypt.compareSync(password, user_found.password);
                } catch (e) {
                    console.log(e)
                    return res.status(401).send({
                        message: "Unauthorized"
                    });
                }

                if (!dcrypt) {
                    return res.status(401).send({
                        message: "Unauthorized"
                    });
                } else {
                    // User is now authorized.. Create a jwt and return
                    var jwt = helper.getLoginJWT({
                        User_ID: user_found._id
                    });

                    // Delete the password attribute since we dont wanna pass it back to the user
                   // delete user_found.dataValues['password'];

                    return res.status(200).send({
                        token: jwt,
                        user: user_found
                    });
                }

            } else {
                //username not found
                return res.status(401).send({
                    message: "Unauthorized"
                });
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                message: "Contact Admin"
            });
        });
    }
}

// TODO: Prompt login when coming to the page
// TODO: Add logout, password reset, and get calls for user