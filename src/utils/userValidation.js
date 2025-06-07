const validator = require("validator");

const userValidation = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("First name and Last is not valid!!" + error.message);
    }

    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!!" + error.message);
    }

    else if (!validator.isStrongPassword(password)) {
        throw new Error("please enter strong password!!" + error.message);
    }
}

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "about", "skills", "photo", "gender", "age"];
    const isEditAllowed = Object.keys(req.body).every((field) => {
        return allowedEditFields.includes(field);
    })

    return isEditAllowed;
}

module.exports = {
    userValidation,
    validateProfileEditData
}