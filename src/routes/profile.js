const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/userValidation');


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

module.exports = profileRouter;