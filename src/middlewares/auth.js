// Admin Auth
const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAdminAuthrised = token === "xyz"

    if (!isAdminAuthrised) {
        console.log("unothrised Admin...")
        res.status(401).send("Unothrised Admin!")
    } else {
        next();
    }
}

// Usaer Auth
const userAuth = (req, res, next) => {
    const userToken = "abc";
    const isUserAuthrised = userToken === "abc"
    if (!isUserAuthrised) {
        console.log("Unothrised user!")
        res.status(401).send("Unothrised user!")
    } else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}