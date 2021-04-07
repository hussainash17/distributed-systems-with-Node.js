"use strict";
exports.__esModule = true;
exports.ExpressApp = void 0;
var express = require("express");
// import express from 'express';
// const app = express();
var ExpressApp = /** @class */ (function () {
    function ExpressApp() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    ExpressApp.prototype.middleware = function () {
        console.log('all middle ware options will be loaded here');
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    };
    ExpressApp.prototype.routes = function () {
        var router = express.Router();
        router.get('/', function (req, res, next) {
            res.json({
                message: 'Hello From Typescript Express Node JS Server.'
            });
        });
        this.express.use('/', router);
    };
    return ExpressApp;
}());
exports.ExpressApp = ExpressApp;
