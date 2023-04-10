const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const multer = require("multer");

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

app.use('/api/v1', require('./src/routes/api'));
app.use((err, req, res, next) => {
    console.log(err);
    const message = err.message ? err.message : 'Server Error Occurred';
    const status = err.status ? err.status : 500;

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: err.message
        })
    }
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
    // Server Listen
    app.listen(port, () => {
      console.log(`Server run success on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

module.exports = app;
