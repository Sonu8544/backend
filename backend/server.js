import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send("Server is ready!");
})

app.get('/jokes', (req, res) => {
    const jokes = [
        {
            "id": 1,
            "title": "The Shy Parrot",
            "description": "Why was the parrot so shy? Because it was afraid to speak up!"
        },
        {
            "id": 2,
            "title": "The Broken Pencil",
            "description": "Why did the pencil break? Because it couldn't handle the pressure!"
        },
        {
            "id": 3,
            "title": "The Lost Dog",
            "description": "Why did the dog sit in the shade? Because he didn't want to be a hot dog!"
        },
        {
            "id": 4,
            "title": "The Musical Tomato",
            "description": "What do you call a musical tomato? A jam session!"
        },
        {
            "id": 5,
            "title": "The Sneezing Pepper",
            "description": "Why did the pepper put on a sweater? Because it was a little chili!"
        }
    ]
    res.send(jokes)
})

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Now backend is start on port: ${port}`)
})