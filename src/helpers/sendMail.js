"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// npm i nodemailer
const nodemailer = require('nodemailer')
module.exports = function (to, subject, message) {

    //* GoogleMail (gmail)
    //* Google -> AccountHome -> Security -> Two-Step-Verify -> App-Passwords
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "example@gmail.com",
            pass: 'vbyt klrm hehd xubl'
        }
    })

    // SendMail:
    transporter.sendMail({
        from: "example@gmail.com",
        to: to,
        subject: subject,
        text: message,
        html: message

    }, function (error, success) {
        success ? console.log('SUCCESS:', success) : console.log('ERROR:', error)
    })

}