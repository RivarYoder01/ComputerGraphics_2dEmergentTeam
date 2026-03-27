const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require("os");

const port = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "localhost";
}

const HOST = "0.0.0.0";

http.listen(port, HOST, () => {
    console.log(`Server running at http://${getLocalIP()}:${port}`);
})

const positions = {};

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    positions[socket.id] = {x: 0.5, y: 0.5 };

    socket.on("disconnect", () => {
        delete positions[socket.id];
        console.log(`${socket.id} disconnected`);
    });

    socket.on("updatePosition", (data) => {
        positions[socket.id].x = data.x;
        positions[socket.id].y = data.y;
    });
});

const frameRate = 30;
setInterval(() => {
    io.emit("positions", positions);
}, 1000 / frameRate);