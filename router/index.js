require("dotenv").config();

const express = require("express");
const { check } = require("express-validator");
const credential = require("../controller/actions/auth").credential();

const MainController = require("../controller/MainController");
const UserController = require("../controller/UserController");

class Router {
  index() {
    const router = express.Router();

    router.get("/", MainController.service);

    /**
     * User Controller
     */

    router.post(
      "/register",
      check("username").exists().notEmpty(),
      check("email").exists().notEmpty(),
      check("phoneNumber").exists().notEmpty(),
      check("password").exists().notEmpty(),
      check("fullname").exists().notEmpty(),
      UserController.register
    );
    router.post(
      "/signin",
      check("username").exists().notEmpty(),
      check("password").exists().notEmpty(),
      UserController.login
    );
    router.post(
      "/update",
      credential,
      check("id").exists(),
      UserController.update
    );
    router.post(
      "/delete",
      credential,
      check("id").exists(),
      UserController.delete
    );

    /**End UserController */

    return router;
  }
}

module.exports = new Router();
