const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const db = require("./config/db.js");
const multer = require("multer");
const config = require('./config/config.js');
const fs = require('fs');
const PORT = 3000;
const uploadDir = config.default.imagePath;
const nodemailer = require('nodemailer');

const { apiResponse } = require("./utils/token.js");

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));


let corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.json());



const userController = require('./controller/userController.js');
const taskController = require('./controller/taskcontroller.js')
const mailController = require('./controller/mailController.js');
const dashboardController = require('./controller/dashboardController.js')

app.use('/userServices', userController);
app.use('/taskServices', taskController);
app.use('/mailServices', mailController);
app.use('/dashboardService', dashboardController)


app.use((err, req, res, next) => {
  const errorResponse = {
    error: `Error in route ${req.path}:`,
    message: `${err.message || 'Internal Server Error'}`,
    supportUrl: 'https://tyagiaryan.com/support'
  };
  res.status(err.status || 500).json(errorResponse);
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.post("/URLlog", (req, res) => {
  const userData = req.body;
  console.log("URLlog Data: ", userData);
  apiResponse(userData)

  res.status(200).json({ message: "User Submitted Successfully" });
});
if (!fs.existsSync(uploadDir)) {
  console.log(`Upload directory doesn't exist: ${uploadDir}`);
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({
  storage: storage

});
app.use('/uploadfile', express.static((uploadDir)));

app.post('/uploadfile', upload.single('userImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = `${req.file.filename}`;
  res.status(200).json({
    message: 'File uploaded successfully',
    //filePath: filePath,

    file: req.file
  });
});


// --------------------------------------------------------------------------------------------
/* app.post("/submitUserData", (req, res) => {
  const userData = req.body;
  console.log("data incoming: ", userData);

  const duplicatedata = `SELECT * FROM user_registration_details
  WHERE email = '${userData.email}';`;
  db.query(duplicatedata, (err, result) => {
    console.log("check duplicate", result.length);

    if (result.length > 0) {
      return res.status(200).json({ message: "Duplicate User" });
    }
    const query = `INSERT INTO user_registration_details(user_name, user_password, age, email, phone_number, address,user_image,reference_field) VALUES ('${userData.name.replace(/'/g, "''")}','${userData.password.replace(/'/g, "''")}',${userData.age},'${userData.email.replace(/'/g, "''")}',${userData.number},'${userData.address.replace(/'/g, "''")}','${userData.imagePath}','${userData.loggedInUseremail}')`;
    console.log(query, "Query for submit");

    db.query(query, (err) => {
      if (err) {
        console.error("Error Submitting User:", err);
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }
      res.status(200).json({ message: "User Submitted Successfully" });
    });
  });
}); */



// ------------------------------------------------------------------------------

/* app.post("/submitloginData", (req, res) => {
  var loginData = req.body;
  console.log("data incoming: ", loginData);

  const query = `SELECT * FROM user_registration_details WHERE email ='${loginData.email}' AND user_password = '${loginData.password}';`;
  console.log(query, "Query for checking Username and Password");

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error checking login:", err);
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }

    if (result.length > 0) {
            res.status(200).json({ message: "Login successful", user: result[0] });
    } else {
      res.json({ message: "Invalid username or password" });
    }
  });
}); */

// app.post('/submitloginData', (req, res) => {
//   const logindata = req.body;
//   console.log("data incoming: ", logindata);

//   // const query = `INSERT INTO user_login_info (user_name, user_password) VALUES (${logindata.username},${logindata.password})`;
//   // const values = [logindata.username, logindata.password];
//    const query = 'SELECT * from user_registration_details where user_name=? AND user_password =?';
//    console.log(query,"Query for check Username and Password");
//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error("Error Submitting Login:", err);
//       return res.status(500).json({ error: "Database error", details: err.message });
//     }

//     res.status(200).json({ message: 'Login Submitted Successfully' });
//   });
// });

// ----------------------------------------------------------------------------------------------------
/* app.post("/dashboardData", (req, res) => {
  const userref = req.body.loggedInUseremail;
  console.log("body============", req.body.loggedInUseremail);
  console.log("body============", req.body);

  console.log("userref===========", userref);
  const query = `SELECT * FROM user_registration_details WHERE reference_field='${userref}';`;
  console.log("qqqqqqqqqqqqq", query);

  db.query(query, (err, result) => {
    if (err) {
      console.error("database error :", err);
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    } else {
      res.status(200).json(result);
    }
  });
}); */
// ---------------------------------------------------------------------------------------------------
// app.post("/deleteUser", (req, res) => {
//   var userData = req.body.deleteuserData;

//   console.log("delete userrr", userData);

//   const query = `DELETE FROM user_registration_details WHERE id='${userData.id}';`;
//   console.log("delete queryy", query);

//   db.query(query, (err) => {
//     if (err) {
//     } else {
//       return res.status(200).send({ message: "User Deleted Successfully!" });
//     }
//   });
// });
// -------------------------------------------------------------------------------------------------
/* app.post("/UpdateUser", (req, res) => {
  const userData = req.body.Updatedata;
  const userid = req.body.id;
  const userurl = req.body.imagePath;
  console.log("data incoming: ", userData);

  const duplidata = `SELECT * FROM user_registration_details 
  WHERE email = '${userData.email}' AND id != ${userid};;`;
  db.query(duplidata, (err, result) => {
    console.log("check duplicate", result.length);
    if (result.length > 0) {
      return res.status(200).json({ message: "Duplicate User" });
    }
    else {
      const UpdateData = `UPDATE user_registration_details 
    SET user_name='${userData.name.replace(/'/g, "''")}', 
        user_password='${userData.password.replace(/'/g, "''")}', 
        age=${userData.age}, 
        email='${userData.email.replace(/'/g, "''")}', 
        phone_number=${userData.number.replace(/'/g, "''")}, 
        address='${userData.address.replace(/'/g, "''")}',
        user_image='${userurl}'
        WHERE id=${userid}`
      db.query(UpdateData, (err) => {
        if (err) {
          console.error("Error Updating User:", err);
          return res
            .status(500)
            .json({ error: "Database error", details: err.message });
        }
        res.status(200).json({ message: "User Updated Successfully" });

      });
    }
  });

});
app.use('/uploads', express.static((uploadDir)));
app.post("/uploads", upload.single('userImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file
  });
});
app.post("/loginuserinfo", (req, res) => {
  const userref = req.body.loggedInUserid;
  console.log("body============", req.body.loggedInUserid);
  console.log("body============", req.body);

  console.log("userref===========", userref);
  const query = `SELECT * FROM user_registration_details WHERE id='${userref}';`;
  console.log("qqqqqqqqqqqqq", query);

  db.query(query, (err, result) => {
    if (err) {
      console.error("database error :", err);
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    } else {
      res.status(200).json(result);
    }
  });
}); */



