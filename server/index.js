require('dotenv').config();
const express = require('express');
const cors = require('cors');
const net = require('net');
const UserModel = require('./models/Users');
const connectDB = require("./conn/conn"); // Import MongoDB connection function

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(response =>
{
    if (response?.status)
    {
        console.error(`Error ${response.status}: ${response.message}`);
    } else
    {
        console.log("Database connected successfully");
    }
});

// Get available ports from .env file
const ports = process.env.PORTS.split(',').map(port => parseInt(port));

// Function to find an available port
const findAvailablePort = async () =>
{
    for (let port of ports)
    {
        const server = net.createServer();
        await new Promise((resolve, reject) =>
        {
            server.listen(port, () =>
            {
                server.once('close', () => resolve(port));
                server.close();
            });
            server.on('error', () => reject());
        }).catch(() => { });
    }
    return ports[0]; // Fallback if none are available
};

// Start the server on an available port
findAvailablePort().then(port =>
{
    app.listen(port, () =>
    {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err =>
{
    console.error("No available ports found", err);
});

// Routes
app.get('/', (req, res) =>
{
    UserModel.find({})
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

app.get('/getUser/:id', (req, res) =>
{
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.post('/createUser', (req, res) =>
{
    UserModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.put('/updateUser/:id', (req, res) =>
{
    const id = req.params.id;
    UserModel.findByIdAndUpdate(id, { name: req.body.name, email: req.body.email, age: req.body.age }, { new: true })
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.delete('/deleteUser/:id', (req, res) =>
{
    const id = req.params.id;
    UserModel.findByIdAndDelete(id)
        .then(response => res.json(response))
        .catch(err => res.json(err));
});