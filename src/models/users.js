const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minUppercase: 1, minSymbols: 1 })) {
                throw new Error("Password is not strong enough" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 50,

    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender`,
        // validate(value) {
        // validate(value) {
        //     if (!["male", "female", "other"].includes(value)) {
        //         throw new Error("Invalid Gender Data")
        //     }
        // },
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    about: {
        type: String,
        default: "Thsis is a default about me",
    },
    skills: {
        type: [String],
        default: ["JavaScript", "React", "Node.Js"],
    },
    // photoUrl: {
    //     type: String,
    //     default: "https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg",
    //     validate(value) {
    //         if (!validator.isURL(value)) {
    //             throw new Error("Invalid URL" + value)
    //         }
    //     }
    // },
    photo: { type: String }
}, {
    timestamps: true,
})


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "devTinder@123", {
        expiresIn: "1d",
    });

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwerdHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwerdHash)
    return isPasswordValid;
}

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;

// module.exports = mongoose.model("User", userSchema);
