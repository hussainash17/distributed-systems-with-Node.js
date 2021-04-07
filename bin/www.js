"use strict";
exports.__esModule = true;
var http = require("http");
var debug_1 = require("debug");
var app_1 = require("../app");
var cluster = require("cluster");
var os_1 = require("os");
debug_1["default"]('custom-express:server');
if (cluster.isMaster) {
    var numCPUs = os_1.cpus().length;
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('online', function (worker) {
        console.log("Worker " + worker.process.pid + " is online");
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log("Worker " + worker.process.pid + " died with code: " + code + " and signal: " + signal);
        console.log('Starting a new worker...');
        cluster.fork();
    });
}
else {
    var App = new app_1.ExpressApp().express;
    var normalizePort = function (val) {
        var port = typeof val === 'string' ? parseInt(val, 10) : val;
        if (isNaN(port))
            return val;
        else if (port >= 0)
            return port;
        else
            return false;
    };
    var port_1 = normalizePort(3000);
    App.set('port', port_1);
    App.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        next();
    });
    var onError = function (error) {
        if (error.syscall !== 'listen')
            throw error;
        var bind = typeof port_1 === 'string' ? 'Pipe ' + port_1 : 'Port ' + port_1;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
    var onListening = function () {
        var addr = server_1.address();
        if (addr != null) {
            var bind = typeof addr === 'string' ? "pipe " + addr : "port " + addr.port;
            console.log("Listening on " + bind);
        }
    };
    var server_1 = http.createServer(App);
    server_1.listen(port_1);
    server_1.on('error', onError);
    server_1.on('listening', onListening);
}
