
// const updateTask = async (payload) => {
//     let data = payload;
//     // const escapeSql = (value) => value?.replace(/'/g, "''");
//     let command = '';
//     let updates = [];
//     let whereQuery = '';


//     try {
//         if (data.taskname) {
//             updates.push(`task_name='${(data.taskname)}'`);
//         }
//         if (data.assignto) {
//             updates.push(`assignedTo='${(data.assignto.id)}'`);
//         }

//         if (data.category) {
//             updates.push(`category='${data.category.name}'`);
//         }

//         if (data.status) {
//             updates.push(`work_status='${data.status}'`);
//         }
//         if (data.duedate) {
//             updates.push(`dueDate='${(data.duedate)}'`);
//         }
//         if (data.description) {
//             updates.push(`work_description='${(data.description)}'`);
//         }
//         //  if (data.duedate) {
//         //     updates.push(`dueDate='${(data.duedate)}'`);
//         // }

//         command = `UPDATE task SET ${updates.join(', ')} `;

//         if (data.id) {
//             whereQuery = `WHERE task_id ='${data.id}'`

//         }
//         let finalCommand = `${command}${whereQuery}`


//         let result = await execCommand.execCommand(finalCommand);
//         return result;
//     }
//     catch (error) {
//         throw new Error("Error while update user: " + error?.message);

//     }

// }

// module.exports = {
//     // addTask, getTask, deleteTask,
//     updateTask,
// }
const execCommand = require('../commandConfig/commandExec');
const addTask = async d => {
    try {
        let fields = [], values = [];
        if (d.taskname) { fields.push('task_name'); values.push(`'${d.taskname}'`); }
        if (d.assignto) { fields.push('assignedTo'); values.push(`'${d.assignto.id}'`); }
        if (d.category) { fields.push('category'); values.push(`'${d.category.name}'`); }
        if (d.status) { fields.push('work_status'); values.push(`'${d.status}'`); }
        if (d.duedate) { fields.push('dueDate'); values.push(`'${d.duedate}'`); }
        if (d.description) { fields.push('work_description'); values.push(`'${d.description}'`); }
        if (d.email) { fields.push('task_reference'); values.push(`'${d.email}'`); }
        if (d.createdAt) { fields.push('createdAt'); values.push(`'${new Date(d.createdAt).toISOString().split('T')[0]}'`); }
        const command = `INSERT INTO task (${fields.join(',')}) VALUES (${values.join(',')})`;
        const result = await execCommand.execCommand(command);
        return { success: true, data: result };
    } catch (e) { throw new Error("Add Task Error: " + e?.message); }
};
// const getTask = async d => {
//     console.log("my task called", d);


//     try {
//         let filter = [];
//         let command = `SELECT task.*, urd.user_name AS assignedToUser FROM task LEFT JOIN user_registration_details urd ON task.assignedTo = urd.id`;
//         if (d.taskname) filter.push(`task_name='${d.taskname}'`);
//         if (d.assignto) filter.push(`assignedTo='${d.assignto}'`);
//         if (d.email) filter.push(`task_reference='${d.email}'`);
//         filter.push(`(is_deleted IS NULL OR is_deleted != 1)`);
//         if (filter.length) command += ` WHERE ${filter.join(' AND ')}`;
//         console.log(command);
//         let result = await execCommand.execCommand(command);

//         return result;
//     } catch (e) { throw new Error("Get Task Error: " + e?.message); }
// };
const getTask = async (d) => {
    // console.log("my task called", d);

    try {
        let filter = [];
        let command = `SELECT task.*, urd.user_name AS assignedToUser 
                       FROM task 
                       LEFT JOIN user_registration_details urd ON task.assignedTo = urd.id`;

        if (d.taskname) filter.push(`task_name='${d.taskname}'`);
        if (d.assignto) filter.push(`assignedTo='${d.assignto}'`);

        if (d.email) filter.push(`task_reference='${d.email}'`);

        filter.push(`(is_deleted IS NULL OR is_deleted != 1)`);

        if (filter.length) {
            command += ` WHERE ${filter.join(' AND ')}`;
        }


        const limit = parseInt(d.limit) || 10;
        const page = parseInt(d.page) || 0;
        const offset = page * limit;

        command += ` ORDER BY task.task_id DESC LIMIT ${limit} OFFSET ${offset}`;

        // console.log("Final SQL command with pagination:", command);


        let result = await execCommand.execCommand(command);


        let countCommand = `SELECT COUNT(*) AS total FROM task`;
        if (filter.length) {
            countCommand += ` WHERE ${filter.join(' AND ')}`;
        }

        let countResult = await execCommand.execCommand(countCommand);
        const total = countResult[0]?.total || 0;
        let selectionResult = {}

        // if (filter.selection) {


        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            let category = element.category
            if (!selectionResult[category]) {
                selectionResult[category] = []
            }
            selectionResult[category].push(element);



            // let dataDump=result.reduce((cur,index)=>{

            // },{})


        }

        return {
            data: result,
            totalRecords: total,
            grouped: selectionResult,
        };
    } catch (e) {
        throw new Error("Get Task Error: " + e?.message);
    }
};

const deleteTask = async d => {
    try {
        const updates = d.delete != null ? [`is_deleted='${d.delete}'`] : [];
        const where = d.dataid ? ` WHERE task_id='${d.dataid}'` : '';
        return await execCommand.execCommand(`UPDATE task SET ${updates.join(', ')}${where}`);
    } catch (e) { throw new Error("Delete Task Error: " + e?.message); }
};
const updateTask = async d => {
    console.log("updt dt", d);
    let command = ""
    try {
        let updates = [];
        if (d.taskname) updates.push(`task_name='${d.taskname}'`);
        if (d.assignto) updates.push(`assignedTo='${d.assignto.id}'`);
        if (d.category) updates.push(`category='${d.category}'`);
        if (d.status) updates.push(`work_status='${d.status}'`);
        if (d.duedate) updates.push(`dueDate='${d.duedate}'`);
        if (d.description) updates.push(`work_description='${d.description}'`);
        const where = d.id ? ` WHERE task_id='${d.id}'` : '';
        command = `UPDATE task SET ${updates.join(', ')}${where}`
        let result = await execCommand.execCommand(command)
        // console.log("Update Command", command);

        return result;
    } catch (e) { throw new Error("Update Task Error: " + e?.message); }
};

const getTaskByID = async data => {
    let id = data.id;
    let command = '';

    try {
        command = `SELECT task.*, urd.user_name AS assignedToUser 
                       FROM task 
                       LEFT JOIN user_registration_details urd ON task.assignedTo = urd.id WHERE  task_id = ${id}`

        // command = ` SELECT * from task where task_id = ${id}`
        let result = await execCommand.execCommand(command)

        return result
    } catch (error) {
        throw new Error("Error while getting the data" + error?.message)

    }

}
module.exports = { addTask, getTask, deleteTask, updateTask, getTaskByID };
