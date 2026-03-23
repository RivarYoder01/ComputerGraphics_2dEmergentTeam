const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    transports: ["websocket"]
});

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.render("index.html");
});

http.listen(port, () => {
    console.log(`Server is active at port:${port}`);
});

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