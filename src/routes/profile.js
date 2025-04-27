const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/userValidation');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid data for profile edit!!");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        // res.send(`${loggedInUser.firstName} your profile updated successfully...`);
        res.json({
            message: `${loggedInUser.forstName} your profile updated successfully...`,
            user: loggedInUser,
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (!req.body.oldPassword || !req.body.newPassword) {
            throw new Error("Please provide old and new password!!");
        }

        const { oldPassword, newPassword } = req.body;
        console.log("Loggedin user: ", newPassword);

        const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);
        if (!isMatch) {
            throw new Error("Old password is not correct!");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedNewPassword;

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your password was updated successfully.`,
            user: {
                _id: loggedInUser._id,
                firstName: loggedInUser.firstName,
                email: loggedInUser.email,
            }
        });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});


module.exports = profileRouter;