// Import required libraries
// express = handles web server
// http = creates server instance
// socket.io = handles real-time communication between players
// os = used to find local IP address

const express = require("express");
const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

const os = require("os");

// SERVER SETUP 

// Use environment port if available, otherwise default to 8080
const port = process.env.PORT || 8080;

// Serve static files from the "public" folder
// This is where your index.html and sketch.js are located
app.use(express.static("public"));

// When someone visits the root URL, send index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// GET LOCAL IP 
// This function finds your computer’s local IP address
// so other devices on the same network can connect

function getLocalIP() {
    const interfaces = os.networkInterfaces();

    // Loop through all network interfaces
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {

            // Look for IPv4 addresses that are NOT internal (not 127.0.0.1)
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }

    // If nothing is found, fallback to localhost
    return "localhost";
}

// Allow connections from any network interface
const HOST = "0.0.0.0";

// Start the server
http.listen(port, HOST, () => {
    console.log(`Server running at http://${getLocalIP()}:${port}`);
});

// PLAYER DATA 

// This object stores all player positions
// Key = socket.id (unique per player)
// Value = { x, y }
const positions = {};

//  SOCKET CONNECTION 

// When a player connects
io.on("connection", (socket) => {

    // Print their unique ID in the console
    console.log(`${socket.id} connected`);

    // Give new player a default starting position (center of screen)
    positions[socket.id] = {
        x: 0.5,
        y: 0.5
    };

    // DISCONNECT
    // When a player leaves the game
    socket.on("disconnect", () => {

        // Remove them from the positions list
        delete positions[socket.id];

        console.log(`${socket.id} disconnected`);
    });

    //  UPDATE POSITION
    // When a player sends updated movement data
    socket.on("updatePosition", (data) => {

        // Update that player's position
        // data.x and data.y are normalized (0 → 1)
        positions[socket.id].x = data.x;
        positions[socket.id].y = data.y;
    });
});

// GAME LOOP

// How many times per second we update all players
const frameRate = 30;

// Send all player positions to everyone at a constant rate
setInterval(() => {

    // Broadcast positions to all connected clients
    io.emit("positions", positions);

}, 1000 / frameRate);