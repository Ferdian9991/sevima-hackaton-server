const { validationResult } = require("express-validator");
const options = require("../config/options");
const userResolvers = require("../database/schema/User/resolvers");
const classroomResolvers = require("../database/schema/Classroom/resolvers");
const auth = require("./actions/auth");

class UserController {
  async register(req, res) {
    const errors = validationResult(req);

    let message = "";

    try {
      if (!errors.isEmpty()) {
        message = "Required parameters missing";
        throw new Error(message);
      }

      message = "Successfully registered a new user!";
      const params = req.body;
      const foundUser = await userResolvers.findByUsername(params);
      const foundClassroom = await classroomResolvers.findByClassCode(params);

      if (foundUser) {
        message = `Username is already exists!`;
        throw new Error(message);
      }

      if (!foundClassroom && params.role == "Student") {
        message = `Class Code not found!`;
        throw new Error(message);
      }

      const data = await userResolvers.register({
        ...params,
        classroomId: foundClassroom ? foundClassroom.id : "",
      });

      options.responseMessage({
        res,
        statusCode: 200,
        auth: false,
        message,
        data,
      });
    } catch (e) {
      options.responseMessage({
        res,
        statusCode: 400,
        auth: false,
        message: e.message,
      });
    }
  }

  async getTeacher(req, res) {
    const context = await auth.getContext(req);
    let message = "";
    if (context.auth) {
      const allTeacher = await userResolvers.findByRole("Teacher");
      message = "Successfully get teacher!";
      options.responseMessage({
        res,
        statusCode: 200,
        auth: context.auth,
        message,
        data: allTeacher,
      });
    } else {
      message = "Unauthorization!";
      options.responseMessage({
        res,
        statusCode: 401,
        auth: context.auth,
        message,
      });
    }
  }

  async getStudent(req, res) {
    const context = await auth.getContext(req);
    let message = "";
    if (context.auth) {
      const allTeacher = await userResolvers.findByRole("Student");
      message = "Successfully get teacher!";
      options.responseMessage({
        res,
        statusCode: 200,
        auth: context.auth,
        message,
        data: allTeacher,
      });
    } else {
      message = "Unauthorization!";
      options.responseMessage({
        res,
        statusCode: 401,
        auth: context.auth,
        message,
      });
    }
  }

  async login(req, res) {
    const errors = validationResult(req);

    let message = "";

    try {
      if (!errors.isEmpty()) {
        throw new Error("Required parameters missing");
      }

      const params = req.body;
      const data = await userResolvers.auth(params);

      if (!data) {
        throw new Error("Invalid login credentials");
      }

      message = `Logged in as ${data.fullname}`;
      options.responseMessage({
        res,
        statusCode: 200,
        auth: false,
        message,
        data,
      });
    } catch (e) {
      options.responseMessage({
        res,
        statusCode: 400,
        auth: false,
        message: e.message,
      });
    }
  }

  async delete(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);

    let message = "";

    if (context.auth) {
      if (!errors.isEmpty()) {
        message = "Required parameters missing";
        options.responseMessage({ res, statusCode: 400, auth: false, message });
        return new Error(message);
      }

      const params = req.body;

      const foundUser = await userResolvers.findById(params);

      if (!foundUser) {
        message = `User not found!`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await userResolvers.delete(params);

      message = `User deleted successfully!`;
      options.responseMessage({
        res,
        statusCode: 200,
        auth: context.auth,
        message,
        data,
      });
    } else {
      message = "Unauthorization!";
      options.responseMessage({
        res,
        statusCode: 401,
        auth: context.auth,
        message,
      });
    }
  }

  async update(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);

    let message = "";

    if (context.auth) {
      if (!errors.isEmpty()) {
        message = "Required parameters missing";
        options.responseMessage({ res, statusCode: 400, auth: false, message });
        return new Error(message);
      }

      const params = req.body;

      const foundUser = await userResolvers.findById(params);

      if (!foundUser) {
        message = `User not found!`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await userResolvers.update(params.id, params);

      message = `User updated successfully!`;
      options.responseMessage({
        res,
        statusCode: 200,
        auth: context.auth,
        message,
        data,
      });
    } else {
      message = "Unauthorization!";
      options.responseMessage({
        res,
        statusCode: 401,
        auth: context.auth,
        message,
      });
    }
  }
}

module.exports = new UserController();
