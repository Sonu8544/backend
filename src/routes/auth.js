const express = require('express');
// const userValidation = require("../utils/userValidation")
const userValidation = require("../utils/userValidation").userValidation;
const UserModel = require("../models/users.js");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
    try {
        userValidation(req);

        const { password } = req.body;
        const saltRounds = 10;
        const passwerdHash = await bcrypt.hash(password, saltRounds);

        const user = new UserModel({
            ...req.body,
            password: passwerdHash,
        });

        await user.save();
        console.log("User created successfully...");
        res.send("User created successfully...");
    } catch (error) {
        res
            .status(400)
            .send("Something went wrong while creating user: " + error.message);
        console.log("Error: ", error.message);
    }
});

authRouter.post("/login", async (req, res) => {
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
            res.send(user);

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

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.send("Logout Successfully!");
    } catch (error) {
        res.status(400).send("Something went wrong while Logout: " + error.message);
        console.log("Error: ", error.message);
    }
})

module.exports = authRouter;

