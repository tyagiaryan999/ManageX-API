const express = require("express");
const router = express.Router();

const dashboardService = require("../services/dashboardService")
router.post("/dashboardData", async (req, res, next) => {
    let data = req.body
    try {

        let result = await dashboardService.dashboardData(data)
        res.status(200).json({
            userRecords: result.userRecords,
            userTotal: result.userTotal,
            taskRecords: result.taskRecords,
            taskTotal: result.taskTotal,
            // deletedTasks: result.deletedTasksCount
        })
    } catch (error) {
        next(error)
    }
}
)

module.exports = router;