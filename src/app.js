const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

app.use(cors({
    origin: "http://54.92.193.254/",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// const userAuth = require("./middlewares/auth.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
    .then(() => {
        console.log("DataBase connection successfully...");

        app.listen(7777, () => {
            console.log("server is successfully listen on port 7777...");
        });
    })
    .catch((error) => {
        console.error("Db connection Fail ", error);
    });
