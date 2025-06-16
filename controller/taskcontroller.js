const express = require("express");
const router = express.Router();
const taskServices = require('../services/taskService');
const mailServices = require('../services/mailService');
router.post("/addTask", async (req, res, next) => {
    const data = { ...req.body };
    const checkFilter = {
        taskname: req.body.taskname,
        assignedto: req.body.assignedto,
    };


    try {
        const checkDuplicate = await taskServices.getTask(checkFilter);
        console.log("Check Duplicate Result:", checkDuplicate);

        if (checkDuplicate?.data?.length > 0) {
            return res.status(200).json({ message: 'Duplicate task' });
        }
        // if (checkFilter.taskname) {
        //     const checkDuplicate = await taskServices.getTask(checkFilter);
        //     if (checkDuplicate?.length > 0) { return res.status(200).json({ message: 'Duplicate task' }); }
        // }
        const result = await taskServices.addTask(data);
        const mailResult = await mailServices.sendMail(data);
        if (mailResult || result) {
            res.status(200).json({ data: result, message: "Task added successfully" });
        }
        // res.status(200).json({ data: result, message: "Task added successfully" });
    } catch (error) {
        next(error);
    }
});
// router.post("/getTask", async (req, res, next) => {
//     let data = req.body;
//     console.log("getTask req.body =", data);
//     try {
//         let result = await taskServices.getTask(data);
//         res.status(200).json({
//             data: result, message: "Task Data"
//         })
//     } catch (error) { next(error) }
// })
router.post("/getTask", async (req, res, next) => {
    let data = req.body;
    console.log("getTask req.body =", data);
    try {
        let result = await taskServices.getTask(data);



        res.status(200).json({
            data: result.data,
            totalRecords: result.totalRecords,
            message: "Task Data"
        });
    } catch (error) {
        next(error);
    }
});

router.post("/deleteTask", async (req, res, next) => {
    let data = req.body;
    try {
        let result = await taskServices.deleteTask(data);
        res.status(200).json({ data: result, message: "Task deleted " })
    } catch (error) { next(error) }
})
router.post("/updateTask", async (req, res, next) => {
    let data = req.body; try {
        let result = await taskServices.updateTask(data); res.status(200).json({ data: result, message: "Task Updated" })
    } catch (error) { }
})
module.exports = router;