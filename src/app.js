const express = require("express");
const connectDB = require("./config/database.js");
const app = express();

const UserModel = require("./models/users.js");
const { userValidation } = require("./utils/userValidation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../src/middlewares/auth");
app.use(express.json());
app.use(cookieParser());

// Create post api
app.post("/signup", async (req, res, next) => {
    try {
        // Validate user data
        userValidation(req);

        // encrypt password before saving to DB
        const { password } = req.body;
        const saltRounds = 10; 
        const passwerdHash = await bcrypt.hash(password, saltRounds);

        const user = new UserModel({
            ...req.body,
            password: passwerdHash,
        });

        await user.save();
        console.log("post Api called...");
        res.send("User Added successfully!");
    } catch (error) {
        res
            .status(400)
            .send("Something went wrong while creating user: " + error.message);
        console.log("Error: ", error.message);
    }
});


// Login API
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await UserModel.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid cradentials!!!");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {

            const token = await user.getJWT();
            console.log("Token generated successfully...");
            console.log("Token: ", token);

            res.cookie("token", token, { expires: new Date(Date.now() + 8 + 900000), httpOnly: true });
            res.send("Login Successfully!");

            console.log("Login Successfully!");
        }
        else {
            throw new Error("Invalid cradentials!!!");
        }

    } catch (error) {
        res
            .status(400)
            .send("Something went wrong while creating user: " + error.message);
        console.log("Error: ", error.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

// Connection request api
app.post("/request", userAuth, async (req, res, next) => {
    try {
        const user = req.user;
        console.log("Request API called...");
        res.send(user.firstName + "sent connection request!");
    } catch (error) {

    }
})

// Get User Data from DB
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await UserModel.find({ emailId: userEmail });
        if (user.length === 0) {
            return res.status(404).send("User not found." + err.message);
        } else {
            res.send(user);
            console.log(user);
        }
    } catch (error) {
        res
            .status(500)
            .send("Something went wrong while fetching user data." + error.message);
    }
});

// Get All user from Batabase
app.get("/feed", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.send(users);
        console.log(users);
    } catch (error) {
        res
            .status(500)
            .send("Something went wrong while fetching user data." + error.message);
    }
});

//  Delate API using userId
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    console.log(userId);
    try {
        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send("User not found.");
        } else {
            res.send("User deleted successfully.");
        }
    } catch (error) {
        res
            .status(500)
            .send("Something went wrong while deleting user data." + error.message);
    }
});

// Update API using userId
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const updatedData = req.body;

    try {
        const AllowedUpdates = [
            "firstName",
            "lastName",
            "skills",
            "password",
            "age",
            "photoUrl",
            "phoneNumber",
            "about",
        ];
        const isValidOperation = Object.keys(updatedData).every((update) =>
            AllowedUpdates.includes(update)
        );
        if (!isValidOperation) {
            throw new error("Invalid updates!" + error.message);
        }

        if (updatedData.skills.length > 5) {
            throw new Error(
                "Skills array should not exceed 5 items." + error.message
            );
        }

        const user = await UserModel.findByIdAndUpdate(userId, updatedData, {
            returnDocument: "after", // Return the updated document
            runValidators: true, // Validate the updated data against the schema
        });
        if (!user) {
            res.status(404).send("User not found." + err.message);
        } else {
            res.send("User updated successfully.");
            console.log(user);
        }
    } catch (error) {
        res
            .status(500)
            .send("Something went wrong while updating user data." + error.message);
    }
});

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
