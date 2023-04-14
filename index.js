const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
<<<<<<< HEAD
const multer = require("multer");
=======
const {readdirSync} = require('fs');
>>>>>>> 612379a (clone ostad lms)
const RoleModel = require('./src/models/Role');
const projectRoles = require('./src/dbSeed/projectRoles');
const PermissionModel = require('./src/models/Permission');
const {permissionsDocuments} = require('./src/dbSeed/projectPermissions');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());
app.use(xss());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use(limiter);

app.get('/', (req, res)=>{
    res.send(`<div style="text-align: center"><h3>Welcome to Lead Educare LMS Backend. <a href="${process.env.FONTEND_URL}">Visit our site</a></h3></div>`)
})

<<<<<<< HEAD
app.use('/api/v1', require('./src/routes/api'));
=======
// app.use('/api/v1', require('./src/routes/auth.route'));
readdirSync('./src/routes').map(r => app.use('/api/v1', require('./src/routes/'+r)));
>>>>>>> 612379a (clone ostad lms)
app.use((err, req, res, next) => {
    console.log(err);
    const message = err.message ? err.message : 'Server Error Occurred';
    const status = err.status ? err.status : 500;

<<<<<<< HEAD
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: err.message
        })
    }
=======
>>>>>>> 612379a (clone ostad lms)
    res.status(status).json({
        error: status === 500 ? 'Server Error Occurred' : message,
    });

});


const port = process.env.PORT || 8000;
// DB Connection
mongoose
  // .connect(process.env.LOCAL_DB)
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB Connected");

 	projectRoles.map(async role => {
           await RoleModel.updateOne({name: role.name}, {$set: {name: role.name}}, {upsert: true});
        });
         permissionsDocuments.map(async permission => {
            await PermissionModel.updateOne({name: permission.name}, {$set: {name: permission.name}}, {upsert: true});
        });
    // Server Listen
    app.listen(port, () => {
      console.log(`Server run success on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

module.exports = app;
