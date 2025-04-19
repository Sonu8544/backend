const mongoose = require("mongoose");

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
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
        max: 50,

    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid Gender Data")
            }
        },
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
    photoUrl: {
        type: String,
        default: "https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg",
    },
},{
    timestamps: true,
})

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;

// module.exports = mongoose.model("User", userSchema);
