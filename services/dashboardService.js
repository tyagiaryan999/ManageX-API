const execCommand = require('../commandConfig/commandExec');
// const dashboardData = async (payload) => {
//     let data = payload
//     let command = "";
//     let countCommand = "";

//     let command2 = ""
//     let countCommand2 = ""
//     filterQuery = [];
//     filterQuery2 = []

//     try {

//         command = `SELECT * FROM user_registration_details `;
//         countCommand = `SELECT COUNT(*) AS totalRecords FROM user_registration_details `;
//         // WHERE reference_field='${data.email}'

//         if (data.email) {
//             filterQuery.push(` reference_field= '${data.email}' `)
//         }
//         if (data.name) {
//             // filterQuery.push(`user_name ='${data.name}'`)
//             filterQuery.push(` user_name LIKE '%${data.name}%' `)

//         }

//         if (filterQuery?.length) {
//             command += ` Where ${filterQuery.join('AND')} `;
//             countCommand += ` Where ${filterQuery.join('AND')} `;
//         }



//         const [result, count] = await Promise.all([
//             execCommand.execCommand(command),
//             execCommand.execCommand(countCommand)
//         ])

//         command2 = `SELECT task.*, urd.user_name AS assignedToUser 
//                        FROM task 
//                        LEFT JOIN user_registration_details urd ON task.assignedTo = urd.id `;


//         if (d.taskname) filterQuery2.push(`task_name='${d.taskname}'`);
//         if (data.assignto) filterQuery2.push(`assignedTo='${d.assignto}'`);

//         if (data.email) filterQuery2.push(`task_reference='${d.email}'`);

//         filterQuery2.push(`(is_deleted IS NULL OR is_deleted != 1)`);

//         if (filterQuery2.length) {
//             command2 += ` WHERE ${filter.join(' AND ')}`;
//         }
//         let countCommand2 = `SELECT COUNT(*) AS total FROM task`;
//         if (filterQuery2.length) {
//             countCommand2 += ` WHERE ${filter.join(' AND ')}`;
//         }

//         let countResult = await execCommand.execCommand(countCommand);
//         const total = countResult[0]?.total || 0;

//         return {
//             records: result,
//             totalRecords: count[0].totalRecords || 0,
//         }
//     }
//     catch (error) {
//         throw new Error("Error while getALLuser : " + error?.message);
//     }

// }
const dashboardData = async (payload) => {
    let data = payload;
    let command = `SELECT * FROM user_registration_details`;
    let countCommand = `SELECT COUNT(*) AS totalRecords FROM user_registration_details`;
    let filterQuery = [];

    let taskCommand = `SELECT task.*, urd.user_name AS assignedToUser 
                       FROM task 
                       LEFT JOIN user_registration_details urd ON task.assignedTo = urd.id`;
    let taskCountCommand = `SELECT COUNT(*) AS total FROM task`;
    let taskFilterQuery = [];
    // let deletedTasksCommand = `SELECT COUNT(*) AS deletedCount FROM task`;
    // let deletedTasksQuery = [];

    try {

        if (data.email) {
            filterQuery.push(`reference_field = '${data.email}'`);
        }

        if (data.name) {
            filterQuery.push(`user_name LIKE '%${data.name}%'`);
        }

        if (filterQuery.length) {
            const whereClause = ` WHERE ${filterQuery.join(' AND ')}`;
            command += whereClause;
            countCommand += whereClause;
        }


        const [userResult, userCountResult] = await Promise.all([
            execCommand.execCommand(command),
            execCommand.execCommand(countCommand),
        ]);


        if (data.taskname) {
            taskFilterQuery.push(`task_name = '${data.taskname}'`);
        }

        if (data.assignto) {
            taskFilterQuery.push(`assignedTo = '${data.assignto}'`);
        }

        if (data.email) {
            taskFilterQuery.push(`task_reference = '${data.email}'`);
        }


        taskFilterQuery.push(`(is_deleted IS NULL OR is_deleted != 1)`);

        if (taskFilterQuery.length) {
            const whereClause = ` WHERE ${taskFilterQuery.join(' AND ')}`;
            taskCommand += whereClause;
            taskCountCommand += whereClause;
        }

        // deletedTasksQuery.push(`is_deleted = 1`);
        // if (deletedTasksQuery.length) {
        //     deletedTasksCommand += ` WHERE ${deletedTasksQuery.join(' AND ')}`;
        // }

        // const [taskResult, taskCountResult, deletedTasksCountResult] = await Promise.all([
        //     execCommand.execCommand(taskCommand),
        //     execCommand.execCommand(taskCountCommand),
        //     execCommand.execCommand(deletedTasksCommand),
        // ]);
        const [taskResult, taskCountResult] = await Promise.all([
            execCommand.execCommand(taskCommand),
            execCommand.execCommand(taskCountCommand),
        ]);


        return {
            userRecords: userResult,
            userTotal: userCountResult[0]?.totalRecords || 0,
            taskRecords: taskResult,
            taskTotal: taskCountResult[0]?.total || 0,
            // deletedTasksCount: deletedTasksCountResult[0]?.deletedCount || 0

        };
    } catch (error) {
        throw new Error("Error while fetching dashboard data: " + error?.message);
    }
};
module.exports = {
    dashboardData,
}
