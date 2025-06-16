const db = require("../config/db.js");

module.exports.execCommand = (command = []) => {
    return new Promise((resolve, reject) => {
        db.query(command, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        });
    })
}


