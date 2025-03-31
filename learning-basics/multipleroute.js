const express = require("express")

const app = express();

// app.use("/user", r1, [r2, r3], r4, r5)

// app.get("/user", (req, res, next) => {
//     console.log("1st Route!")
//     // res.send("1st Route!")
//     next();
// }, [
//     (req, res, next) => {
//         console.log("2st Route!")
//         // res.send("2nd Route")
//         next();
//     },
//     (req, res, next) => {
//         console.log("3st Route!")
//         res.send("3rd Route")
//     }],
//     (req, res, next) => {
//         console.log("4st Route!")
//         res.send("4th Route")
//     },
//     (req, res, next) => {
//         console.log("5st Route!")
//         res.send("5th Route")
//     }

// )



// Another way multiple route handler it is independent
app.get("/hello", (req, res, next) => {
    console.log("1st Route Hello...")
    // res.send("1nd Hello route...")
    next();
})

app.get("/hello", (req, res, next) => {
    console.log("2nd route execute!")
    res.send({ name: "Sonu Kumar", home: "Samho DIH" })
})



app.listen(5555, () => {
    console.log("server is successfully listen on port 5555...")
});