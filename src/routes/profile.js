const express = require('express');
const multer = require('multer');
const path = require('path');
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

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // make sure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: multer.memoryStorage() }); // Store in memory


// PATCH route to update profile
profileRouter.patch("/profile/edit", upload.single("photo"), userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid data for profile edit!!");
        }

        const loggedInUser = req.user;

        // Update other fields
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        // Handle photo upload
        if (req.file) {
            // Convert buffer to base64
            const base64Image = req.file.buffer.toString("base64");
            const mimeType = req.file.mimetype; // example: 'image/jpeg'
            loggedInUser.photo = base64Image;
        }

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} your profile updated successfully...`,
            user: loggedInUser,
        });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});


// Previous version of the PATCH route that used file system storage

// profileRouter.patch("/profile/edit", upload.single("photo"), userAuth, async (req, res) => {
//     try {
//         if (!validateProfileEditData(req)) {
//             throw new Error("Invalid data for profile edit!!");
//         }

//         const loggedInUser = req.user;

//         Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

//         await loggedInUser.save();
//         // res.send(`${loggedInUser.firstName} your profile updated successfully...`);
//         res.json({
//             message: `${loggedInUser.forstName} your profile updated successfully...`,
//             user: loggedInUser,
//         })

//     } catch (error) {
//         res.status(400).send("ERROR: " + error.message);
//     }
// })

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (!req.body.oldPassword || !req.body.newPassword) {
            throw new Error("Please provide old and new password!!");
        }

        const { oldPassword, newPassword } = req.body;

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