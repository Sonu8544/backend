const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// const userAuth = require("./middlewares/auth.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
    .then(() => {
        console.log("DataBase connection successfully...");

        app.listen(5555, () => {
            console.log("server is successfully listen on port 5555...");
        });
    })
    .catch((error) => {
        console.error("Db connection Fail ");
    });
