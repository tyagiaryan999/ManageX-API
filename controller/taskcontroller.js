const express = require("express");
const router = express.Router();
const taskServices = require('../services/taskService');
const mailServices = require('../services/mailService');
router.post("/addTask", async (req, res, next) => {
    const data = { ...req.body };
    const checkFilter = {
        taskname: req.body.taskname,
        // assignedto: req.body.assignedto,
    };
    const checkDuplicate = await taskServices.getTask(checkFilter);


    if (checkDuplicate?.totalRecords > 1) {
        return res.status(200).json({ type: 'duplicate', message: 'Duplicate task' });
    }

    try {
        const result = await taskServices.addTask(data);
        // mailServices.sendMail(data);
        return res.status(200).json({ data: result, type: 'success', message: "Task added successfully" });

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
    // console.log("getTask req.body =", data);
    try {
        let result = await taskServices.getTask(data);

        // console.log("Grouped Task", result.grouped)

        res.status(200).json({
            data: result.data,
            totalRecords: result.totalRecords,
            grouped: result.grouped,
            message: "Task Data"
        });
    } catch (error) {
        next(error);
    }
});

router.post("/deleteTask", async (req, res, next) => {

    let data = req.body;
    // console.log("Delete req.body ", req.body)
    if (!data.dataid) {
        return res.status(400).json({
            error: 'error',
            message: "task id not provided"
        })
    }
    try {
        let result = await taskServices.deleteTask(data);
        res.status(200).json({ data: result, message: "Task deleted " })
    } catch (error) { next(error) }
})
router.post("/updateTask", async (req, res, next) => {
    let data = req.body;
    // console.log("Update task request", data);

    try {
        let result = await taskServices.updateTask(data);
        return res.status(200).json({ data: result, message: "Task Updated" })
    }
    catch (error) { next(error) }
})
router.post("/getTaskById", async (req, res, next) => {
    debugger
    let data = req.body
    // console.log("getTaskById Request", data)
    try {
        let result = await taskServices.getTaskByID(data)
        // console.log("getTaskById Response", result)
        res.status(200).json({ data: result, message: "Success" })
    } catch (error) {
        next(error)
    }
})
module.exports = router;