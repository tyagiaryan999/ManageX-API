const nodemailer = require('nodemailer');
const authToken = require('../utils/token')
const sendMail = async (data) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'aryantyagi282000@gmail.com', pass: 'grim qlje agoj psxh' }
    });
    const mailOptions = {
        from: 'aryantyagi282000@gmail.com',
        to: `${data.assignto.email}`,
        subject: `${data.taskname}`,
        text: `${data.description}`
    };
    // console.log("mail setup : ", mailOptions);
    const result = await transporter.sendMail(mailOptions);
    return result;
};
const otpMail = async (data) => {
    let tokken = await authToken.generateMathToken();
    // console.log("otpMail.............", data);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aryantyagi282000@gmail.com', pass: 'grim qlje agoj psxh'
        }
    });
    const mailOptions = {
        from: 'aryantyagi282000@gmail.com',
        to: `${data.email}`,
        subject: `Login OTP`,
        text: `Your Login OTP is ${tokken} . Do Not Share this with Anyone.`
    };
    const result = await transporter.sendMail(mailOptions);
    // console.log("otpMail Service result", result);
    return {
        tokken, result
    };
}
module.exports = {
    sendMail, otpMail,
};
