const { path } = require('express/lib/application');
const execCommand = require('../commandConfig/commandExec')
const authToken = require('../utils/token')
const fs = require('fs');
const jsonPath = require('path');
const { raw } = require('body-parser');
const multer = require('multer');
const imgpath = require('path');



const addUser = async (payload) => {
    let data = payload;

    const escapeSql = (value) => value?.replace(/'/g, "''");
    let command = '';
    let values = [];
    let fields = [];

    try {
        if (data.name) {
            fields.push('user_name');
            values.push(`'${escapeSql(data.name)}'`)

        }
        if (data.password) {
            fields.push('user_password');
            values.push(`'${escapeSql(data.password)}'`)

        }
        if (data.age) {
            fields.push('age');
            values.push(`'${data.age}'`);
        }
        if (data.email) {
            fields.push('email');
            values.push(`'${escapeSql(data.email)}'`);
        }
        if (data.number) {
            fields.push('phone_number');
            values.push(`'${data.number}'`);
        }
        if (data.address) {
            fields.push('address');
            values.push(`'${escapeSql(data.address)}'`);
        }
        if (data.imagePath) {
            fields.push('user_image');
            values.push(`'${data.imagePath}'`);
        }
        if (data.loggedInUseremail) {
            fields.push('reference_field');
            values.push(`'${escapeSql(data.loggedInUseremail)}'`);
        }
        command = `INSERT INTO user_registration_details  (${fields.join(',')}) VALUES (${values.join(',')})`;
        let result = await execCommand.execCommand(command);
        return result;

    } catch (error) {
        throw new Error("Error while adding user : " + error?.message);
    }

}


// const loginUser = async (payload) => {
//     const { email, password } = payload;

//     const command = `SELECT * FROM user_registration_details WHERE email = '${email}' AND user_password = '${password}'`;

//     try {


//         const result = await execCommand.execCommand(command);
//         console.log(result);

//         let token = '';
//         if (result) {
//             token = await authToken.generateMathToken();
//         }
//         console.log("tokennn" + token);
//         console.log("emailll" + result[0].email);


//         return {
//             token,
//             email: result[0].email,
//             id: result[0].id,
//         };

//     } catch (error) {
//         throw new Error("Error while login user : " + error?.message);
//     }

// }
const loginUser = async (payload) => {
    const { email, password } = payload;

    const command = `SELECT * FROM user_registration_details WHERE email = '${email}' AND user_password = '${password}'`;

    try {
        const result = await execCommand.execCommand(command);
        console.log(result);

        if (!result || result.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = result[0];
        const token = await authToken.generateMathToken();

        return {
            token,
            email: user.email,
            id: user.id,
        };
    } catch (error) {
        throw new Error("Error while login user: " + error?.message);
    }
}


const updateUserById = async (payload) => {
    debugger
    let data = payload;
    const escapeSql = (value) => value?.replace(/'/g, "''");
    let command = '';
    let updates = [];
    let whereQuery = '';
    try {
        if (data.name) {
            updates.push(`user_name='${escapeSql(data.name)}'`);
        }
        if (data.password) {
            updates.push(`user_password='${escapeSql(data.password)}'`);
        }
        if (data.age) {
            updates.push(`age='${data.age}'`);
        }
        if (data.number) {
            updates.push(`phone_number='${data.number}'`);
        }
        if (data.address) {
            updates.push(`address='${escapeSql(data.address)}'`);
        }
        if (data.imagePath) {
            updates.push(`user_image = '${data.imagePath}'`);
            // values.push(data.imagePath);
        }

        command = `UPDATE user_registration_details SET ${updates.join(', ')} `;
        if (data.email) {
            whereQuery = `WHERE email='${data.email}'`
        }
        let finalCommand = `${command}${whereQuery}`
        let result = await execCommand.execCommand(finalCommand);
        return result;
    }
    catch (error) {
        throw new Error("Error while update user: " + error?.message);
    }
}
const deleteUserById = async (payload) => {
    let data = payload;
    const command = `DELETE FROM user_registration_details WHERE id='${data.id}';`;
    try {
        const result = await execCommand.execCommand(command);
    } catch (error) {
        throw new Error("Error while Delete user: " + error?.message);

    }

}


const getUserById = async (payload) => {
    let data = payload;
    let command = '';

    try {
        command = `SELECT * FROM user_registration_details WHERE email = '${data.email}';`;
        const result = await execCommand.execCommand(command);
        console.log("returnnnnnn formmm getuserById" + result);

        return result;
    } catch (error) {
        throw new Error("Error while get User: " + error?.message);
    }

}

const getAllUser = async (payload) => {


    let data = payload;
    console.log("upcoming data user : ", data);

    const pagination = data.pagination || {};
    let page = pagination.page || 0;
    let limit = pagination.limit || 10;
    let offset = page * limit;

    let command = "";
    let countCommand = "";
    filterQuery = [];

    try {

        command = `SELECT * FROM user_registration_details `;
        countCommand = `SELECT COUNT(*) AS totalRecords FROM user_registration_details `;
        // WHERE reference_field='${data.email}'

        if (data.email) {
            filterQuery.push(` reference_field= '${data.email}' `)
        }
        if (data.name) {
            // filterQuery.push(`user_name ='${data.name}'`)
            filterQuery.push(` user_name LIKE '%${data.name}%' `)

        }

        if (filterQuery?.length) {
            command += ` Where ${filterQuery.join('AND')} `;
            countCommand += ` Where ${filterQuery.join('AND')} `;
        }

        command += `LIMIT ${limit} offset ${offset}`;


        console.log(command);


        const [result, count] = await Promise.all([
            execCommand.execCommand(command),
            execCommand.execCommand(countCommand)
        ])
        return {
            records: result,
            totalRecords: count[0].totalRecords || 0,
        };

    } catch (error) {
        throw new Error("Error while getALLuser : " + error?.message);
    }

}
const loginUserinfo = async (payload) => {
    let data = payload;
    console.log("log : ", data);

    let command = '';
    filterQuery = [];

    try {
        command = `SELECT * FROM user_registration_details `;
        if (data.email) {
            filterQuery.push(`email='${data.email}'`);
        }
        if (filterQuery.length > 0) {
            command += `WHERE ${filterQuery.join('AND')}`;
        }

        console.log(">>>", command);

        const result = await execCommand.execCommand(command);
        return result;

    } catch (error) {
        throw new Error('Error while getting LoginUser Info: ' + error?.message);
    }
}
// const userActivityInfo = async () => {
//     // const interceptorPath = jsonPath.join(__dirname, 'interceptor.json')
//     // let jsonData = [];
//     // if (fs.existsSync(interceptorPath)) {

//     //     const raw = fs.readFileSync(interceptorPath, 'utf-8');
//     //     const stringArray = JSON.parse(raw);

//     //     jsonData = await stringArray.map(item => JSON.parse(item));
//     // }
//     // console.log("userActivity jsonData", jsonData)
//     // return jsonData
//     const interceptorPath = jsonPath.join(__dirname, '../utils/interceptor.json');
//     let jsonData = [];

//     if (fs.existsSync(interceptorPath)) {
//         const raw = fs.readFileSync(interceptorPath, 'utf-8');

//         try {
//             const stringArray = JSON.parse(raw); // array of strings
//             jsonData = stringArray.map(item => {
//                 // clean newline and parse
//                 return JSON.parse(item.trim());
//             });
//         } catch (err) {
//             console.error("Error parsing interceptor.json", err);
//         }
//     } else {
//         console.log("interceptor.json file not found.");
//     }

//     return jsonData;
// }


// const userActivityInfo = async () => {
//     const interceptorPath = jsonPath.join(__dirname, '../utils/interceptor.json');
//     let jsonData = [];

//     if (fs.existsSync(interceptorPath)) {
//         try {
//             const raw = fs.readFileSync(interceptorPath, 'utf-8');

//             if (!raw || raw.trim() === "") {
//                 console.log("interceptor.json is empty");
//                 return [];
//             }

//             const stringArray = JSON.parse(raw); // array of strings

//             jsonData = stringArray.map((str, index) => {
//                 try {
//                     return JSON.parse(str.trim());
//                 } catch (err) {
//                     console.warn(` Error parsing item at index ${index}:`, err.message);
//                     return null; // skip this entry
//                 }
//             }).filter(Boolean); // remove nulls

//         } catch (err) {
//             console.error("Error reading or parsing interceptor.json:", err.message);
//         }
//     } else {
//         console.warn("interceptor.json file not found at path:", interceptorPath);
//     }

//     return jsonData;
// };

const userActivityInfo = async (payload) => {
    let data = payload;
    console.log("mmmmmm", payload);

    const interceptorPath = jsonPath.join(__dirname, '../../server/utils/interceptor.json');
    let jsonData = [];

    if (fs.existsSync(interceptorPath)) {
        try {
            const raw = fs.readFileSync(interceptorPath, 'utf-8');

            if (!raw || raw.trim() === '') {
                console.log("interceptor.json is empty");
                return [];
            }

            const stringArray = JSON.parse(raw);
            jsonData = stringArray.filter(item => {
                return item.email == data.email && item.time == data.activityDate;
            });


            // jsonData = stringArray;
            // jsonData = stringArray.filter(function (i, n) {
            //     return n.email === email
            // })

            // jsonData = stringArray.filter(item => item.email === email);
        } catch (err) {
            console.error("Error parsing JSON:", err.message);
        }
    } else {
        console.log("interceptor.json does not exist");
    }

    return jsonData;
};




module.exports = {
    addUser, loginUser, deleteUserById, updateUserById, getUserById, getAllUser, loginUserinfo, userActivityInfo,
}