const { validationResult } = require("express-validator");
const options = require("../config/options");
const classroomResolvers = require("../database/schema/Classroom/resolvers");
const auth = require("./actions/auth");

class ClassroomController {
  async getClassroom(req, res) {
    const context = await auth.getContext(req);
    let message = "";
    if (context.auth) {
      const allClassrooms = await classroomResolvers.getClassrooms();
      message = "Successfully get classroom!";
      options.responseMessage({
        res,
        statusCode: 200,
        auth: context.auth,
        message,
        data: allClassrooms,
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

  async create(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);

    let message = "";

    if (context.auth) {
      if (!errors.isEmpty()) {
        message = "Required parameters missing";
        options.responseMessage({ res, statusCode: 400, auth: false, message });
        throw new Error(message);
      }

      message = "Successfully registered a new Classroom!";
      const params = req.body;
      params["userId"] = context.user.id;
      if (!params.classCode)
        params.classCode = Math.random()
          .toString(36)
          .replace("0.", "" || "");

      const data = await classroomResolvers.create(params);

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
        throw new Error(message);
      }

      const params = req.body;

      const foundClassroom = await classroomResolvers.findById(params);

      if (!foundClassroom) {
        message = `Cannot find Classroom id ${params.id}`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await classroomResolvers.update(params.id, params);

      message = `Classroom updated successfully!`;
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

  async delete(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);

    let message = "";

    if (context.auth) {
      if (!errors.isEmpty()) {
        message = "Required parameters missing";
        options.responseMessage({ res, statusCode: 400, auth: false, message });
        throw new Error(message);
      }

      const params = req.body;

      const foundClassroom = await classroomResolvers.findById(params);

      if (!foundClassroom) {
        message = `Cannot find Classroom id ${params.id}`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await classroomResolvers.delete(params);

      message = `Classroom deleted successfully!`;
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

module.exports = new ClassroomController();
