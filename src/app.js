const express = require("express");

const connectDB = require("./config/database.js")

const app = express();
const UserModel = require("./models/users.js")



// Create post api 
app.post("/signup", async (req, res, next) => {
    // User object
    // const userObject = {
    //     firstName: "Sonu",
    //     lastName: "Kumar",
    //     emailId: "sonu@gmail.com",
    //     password: "sonu1234"
    // }

    const user = new UserModel({
        firstName: "Arti",
        lastName: "Singh",
        emailId: "arti@gmail.com",
        password: "arti1234333333333333333333"
    });

    await user.save()

    console.log("post Api called...")
    res.send("User Added successfully!");
})

connectDB()
    .then(() => {
        console.log("DataBase connection successfully...");

        app.listen(5555, () => {
            console.log("server is successfully listen on port 5555...")
        });

    })
    .catch((error) => {
        console.error("Db connection Fail ")
    });