const express = require("express");
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

server.use(morgan("dev")); //status response and time
server.use(express.json());
server.use(cors()); //Everyone can connect with server

server.use(router);

module.exports = server;
