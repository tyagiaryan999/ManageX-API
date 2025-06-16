const { log } = require('console');
const fs = require('fs');
const path = require('path');
const generateMathToken = () => {
    const min = 1000000;
    const max = 9999999;
    const token = Math.floor(Math.random() * (max - min) + min);
    return token;
}
const apiResponse = (responseData) => {
    // console.log("url to print : ", responseData);

    const datapath = path.join(__dirname, 'interceptor.txt');
    const jsonpath = path.join(__dirname, 'interceptor.json');
    const entry = `${JSON.stringify(responseData)}\n`;

    if (!responseData.url.includes('http://localhost:3000/URLlog')) {

        fs.appendFile(datapath, entry, (err) => {
            if (err) {
                console.error("TXT Error", err);
            }
        });

        let jsonData = [];


        if (fs.existsSync(jsonpath)) {
            try {
                const raw = fs.readFileSync(jsonpath, 'utf-8');

                if (raw.trim()) {
                    jsonData = JSON.parse(raw);
                }
            } catch (err) {
                console.error("Error reading or parsing JSON:", err.message);
            }
        }


        jsonData.push(responseData);


        try {
            fs.writeFileSync(jsonpath, JSON.stringify(jsonData, null, 2));
        } catch (err) {
            console.error("Error writing JSON:", err);
        }
    }

    return true;
};
module.exports = {
    generateMathToken, apiResponse
}

