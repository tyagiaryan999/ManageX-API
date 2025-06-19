const express = require("express");
const router = express.Router();
const userServices = require('../services/userService');
const mailServices = require('../services/mailService');
const upload = require('../middleware/upload.js')
router.post("/addUser", upload.single('userImage'), async (req, res, next) => {
    let data = req.body;
    const file = req.file;
    // console.log("AddUser Body", data)
    if (file) {
        data.imagePath = file.filename;
    }

    try {
        let result = await userServices.addUser(data);
        if (result) {
            res.status(200).json({
                data: result,
                message: "User Submitted Successfully"
            });
        }
    } catch (error) {
        next(error)
    }
});
router.post("/loginUser", async (req, res, next) => {
    // console.log("login details ")
    let data = req.body;

    // console.log("login details : ", data);


    try {
        let result = await userServices.loginUser(data);
        res.status(200).json({ data: result, message: "success" });
    } catch (error) {
        res.status(401).json({ message: error.message });
        next(error)
    }
});
router.post("/getUser", async (req, res, next) => {
    let data = req.body;


    try {
        let result = await userServices.getUserById(data);


        res.status(200).json({
            data: result,
            message: "User data"
        });
    } catch (error) {
        next(error)
    }
});
router.post("/deleteUserById", async (req, res, next) => {

    let data = req.body;
    try {
        let result = await userServices.deleteUserById(data);
        res.status(200).json({
            data: result,
            message: "User Deleted"
        })

    } catch (error) {
        next(error)
    }
});
router.post("/updateUserById", async (req, res, next) => {
    let data = req.body;
    // console.log("Update User Data", data)
    try {
        let result = await userServices.updateUserById(data);
        // console.log("UpdateUser Resulttt", result)
        res.status(200).json({
            data: result,
            message: "User Updated"
        })
    } catch (error) {
        next(error)
    }
});
router.post("/getAllUser", async (req, res, next) => {
    let data = req.body;
    // console.log("upcomimg payload 11 " + data);
    try {
        let result = await userServices.getAllUser(data);

        res.status(200).json({
            data: result,
            message: "All User Data"
        })
    } catch (error) {
        next(error)
    }
});
router.post("/loginUserinfo", async (req, res, next) => {
    let data = req.body;
    try {
        let result = await userServices.loginUserinfo(data);
        res.status(200).json({
            data: result,
            message: "Login Successfull"
        })
    } catch (error) {
        next(error)
    }
});
router.post("/userActivityInfo", async (req, res, next) => {
    const data = req.body
    try {
        let result = await userServices.userActivityInfo(data);
        // console.log("userActivityInfo Result", result)
        res.status(200).json({
            message: "userActivityInfo Data",
            data: result,
        })

    }
    catch (error) {
        next(error)
    }

})
module.exports = router;