const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
const mailServices = require('../services/mailService');

router.post('/sendMail', async (req, res, next) => {
    let data = req.body;
    try {
        let result = await mailServices.sendMail(data);

        res.status(200).json({ data: result, message: "mail sended successfully" });
    } catch (error) {
        next(error);
    }
})
router.post('/otpMail', async (req, res, next) => {
    let data = req.body;
    try {
        let result = await mailServices.otpMail(data);
        console.log("otpMail Result....", result)
        res.status(200).json({ data: result, message: "OTP send succesfully" })
    } catch (error) {
        next(error);
    }
})

module.exports = router;