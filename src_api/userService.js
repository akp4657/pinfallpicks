import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import * as config from '../config.js';
import * as bcrypt from 'bcrypt-nodejs';
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

// Sign up call
export const addUser = async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    // Check if the username isn't taken
    models.user.findOne({
        where: {
            username: username
        }
    }).then(user_found => {
        if (user_found) {
            helper.sendResponse(res, 200, false, {
                message: 'Username is taken.',
            });
        } else {
            //carry on
            //hash password
            const salt = bcrypt.genSaltSync(config.pwd_salt_rounds);
            var hash = bcrypt.hashSync(password, salt);

            //create user
            models.staff.create({
                username: username,
                password: hash,
                email: email
            }).then(user_created => {
                return res.status(200).send({
                    user: user_created
                });
            }).catch(err => {
                console.log(err)
                return res.status(500).send({
                    message: "Contact Admin"
                });
            });
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).send({
            message: "Contact Admin"
        });
    });
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