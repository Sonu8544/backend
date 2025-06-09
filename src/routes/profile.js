const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/userValidation');
const bcrypt = require('bcrypt');
const multer = require('multer')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({
    cloud_name: 'dj8kc5gck',
    api_key: '324524992759673',
    api_secret: 'ylj5wPsW4LowAfWmF9zY_D8xjpM'
});

const profileRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const random = uuidv4();
        cb(null, random + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

profileRouter.patch("/profile/edit", upload.single('photo'), userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid data for profile edit!");
        }

        const loggedInUser = req.user;
        let uploadResult = null;

        // ✅ Only upload to Cloudinary if file is present
        if (req.file) {
            try {
                uploadResult = await cloudinary.uploader.upload(req.file.path);
                console.log("Image_url: " + JSON.stringify(uploadResult.secure_url));

                // ✅ Delete the file from local after upload
                fs.unlink(req.file.path, (err) => {
                    if (err) console.log("Error during file delete: " + err);
                    else console.log("File deleted successfully");
                });

                // ✅ Save image URL to user model
                if (uploadResult?.secure_url) {
                    loggedInUser.photoUrl = uploadResult.secure_url;
                }
            } catch (uploadErr) {
                console.log("Cloudinary upload error: " + uploadErr);
            }
        }

        // ✅ Assign other fields safely
        Object.keys(req.body).forEach((key) => {
            if (key in loggedInUser) {
                loggedInUser[key] = req.body[key];
            }
        });

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} your profile updated successfully...`,
            user: loggedInUser,
            file: req.file || null
        });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});






profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

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