const express = require("express");

const connectDB = require("./config/database.js")

const app = express();
const UserModel = require("./models/users.js")

// Middle ware for parsing application/json
app.use(express.json());


// Create post api 
app.post("/signup", async (req, res, next) => {
    const user = new UserModel(req.body);
    console.log(user)

    await user.save()
    console.log("post Api called...")
    res.send("User Added successfully!");
})


// Get User Data from DB
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await UserModel.find({ emailId: userEmail });
        if (user.length === 0) {
            return res.status(404).send("User not found.");
        } else {
            res.send(user);
            console.log(user)
        }

    } catch (error) {
        res.status(500).send("Something went wrong while fetching user data.", error);
    }
})


// Get All user from Batabase
app.get("/feed", async (req, res) => {
    try {
        const users = await UserModel.find({}); 
        res.send(users);
        console.log(users) 

    } catch (error) {
        res.status(500).send("Something went wrong while fetching user data.", error);
    }
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