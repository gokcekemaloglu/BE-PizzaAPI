"use strict"
const passwordEncrypt = require("../helpers/passwordEncrypt")
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

const User = require("../models/user")
const Token = require("../models/token")
const jwt = require("jsonwebtoken")

module.exports = {
    login: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA?123456",
                }
            }
        */

        const {userName, email, password} = req.body

        if(!((userName || email) && password)) {
            res.errorStatusCode = 401
            throw new Error("Username/Email and Password required!")
        }

        const user = await User.findOne({$or: [{userName}, {email}]})

        if (user?.password !== passwordEncrypt(password)) {
            res.errorStatusCode = 401
            throw new Error("Username/Email or Password invalid!")
        }

        if (!user?.isActive) {
            res.errorStatusCode = 401
            throw new Error("User is not active!")
        }

        // Simple Token
        let tokenData = Token.findOne({userId: user._id })
        if (!tokenData) {
            tokenData = await Token.create({
                userId: user._id,
                token: passwordEncrypt(user._id + Date.now())
            })
        }

        // JWT

        // const {_id, userName, email, isActive, isAdmin} = user
        // AccessToken:
        const accessData = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            isActive: user.isActive,
            isAdmin: user.isAdmin
        }

        // Convert to jwt
        // jwt.sign(payload, key, {expireIn: })
        const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, {expiresIn: "30min"})

        // RefreshToken:
        const refreshData = {
            _id: user._id,
            password: user.password
        }

        // Convert to JWT
        const refreshToken = jwt.sign(refreshData, process.env.REFRESH_KEY, {expiresIn: "1d"})

        res.status(200).send({
            errror: false,
            message: "Login Successfull",
            token: tokenData.token,
            bearer: {
                access: accessToken,
                refresh: refreshToken
            },
            user
        })
    },
    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "simpleToken: Logout"
            #swagger.description = 'Delete token key.'
        */
       const auth = req.headers?.authorization
       const tokenKey = auth ? auth.split(" ") : null // array
       const result = await Token.deleteOne({token: tokenKey[1]})
        res.status(200).send({
            error: false,
            message: "Logout Successfull, token deleted",
            result
        })
    },
}