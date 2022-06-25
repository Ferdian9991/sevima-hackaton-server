require("dotenv").config();

const express = require("express");
const { check } = require("express-validator");
const credential = require("../controller/actions/auth").credential();

const MainController = require("../controller/MainController");
const UserController = require("../controller/UserController");
const ClassroomController = require("../controller/ClassroomController");
const TaskController = require("../controller/TaskController");
const AnswerTaskController = require("../controller/AnswerTaskController");

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
      "/update-user",
      credential,
      check("id").exists(),
      UserController.update
    );
    router.post(
      "/delete-user",
      credential,
      check("id").exists(),
      UserController.delete
    );
    router.get("/get-teacher", credential, UserController.getTeacher);
    router.get("/get-student", credential, UserController.getStudent);

    /** End User Controller */

    /**
     * Classroom Controller
     */

    router.post(
      "/register-classroom",
      credential,
      check("name").exists(),
      ClassroomController.create
    );
    router.post(
      "/update-classroom",
      credential,
      check("id").exists(),
      ClassroomController.update
    );
    router.post(
      "/delete-classroom",
      credential,
      check("id").exists(),
      ClassroomController.delete
    );
    router.get("/get-classroom", credential, ClassroomController.getClassroom);

    /** End Classroom Controller */

    /**
     * Task Controller
     */

    router.post(
      "/add-task",
      credential,
      check("name").exists(),
      TaskController.create
    );
    router.post(
      "/update-task",
      credential,
      check("id").exists(),
      TaskController.update
    );
    router.post(
      "/delete-task",
      credential,
      check("id").exists(),
      TaskController.delete
    );
    router.post("/get-task", credential, TaskController.getTask);

    /** End Task Controller */

    /**
     * AnswerTask Controller
     */

    router.post(
      "/add-answertask",
      credential,
      check("content").exists(),
      AnswerTaskController.create
    );
    router.post(
      "/get-answertask",
      credential,
      check("taskId").exists(),
      AnswerTaskController.getAnswerTask
    );
    router.post(
      "/get-oneAnswertask",
      credential,
      check("taskId").exists(),
      AnswerTaskController.getOneAnswerTask
    );
    router.post(
      "/update-answertask",
      credential,
      check("id").exists(),
      AnswerTaskController.update
    );

    /** End AnswerTask Controller */

    return router;
  }
}

module.exports = new Router();
