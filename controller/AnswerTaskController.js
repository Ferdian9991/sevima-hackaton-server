const { validationResult } = require("express-validator");
const options = require("../config/options");
const answerTaskResolvers = require("../database/schema/AnswerTask/resolvers");
const auth = require("./actions/auth");

class AnswerTaskController {
  async getAnswerTask(req, res) {
    const context = await auth.getContext(req);
    let message = "";
    if (context.auth) {
      const allAnswerTask = await answerTaskResolvers.getAnswerTasks();
      message = "Successfully get answerTask!";
      options.responseMessage({
        res,
        statusCode: 200,
        auth: context.auth,
        message,
        data: allAnswerTask,
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

      message = "Successfully registered a new answerTask!";
      const params = req.body;
      params["userId"] = context.user.id;
      if (!params.classCode)
        params.classCode = Math.random()
          .toString(36)
          .replace("0.", "" || "");

      const data = await answerTaskResolvers.create(params);

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

      const foundAnswerTask = await answerTaskResolvers.findById(params);

      if (!foundAnswerTask) {
        message = `Cannot find answerTask id ${params.id}`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await answerTaskResolvers.update(params.id, params);

      message = `answerTask updated successfully!`;
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

      const foundAnswerTask = await answerTaskResolvers.findById(params);

      if (!foundAnswerTask) {
        message = `Cannot find answerTask id ${params.id}`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await answerTaskResolvers.delete(params);

      message = `answerTask deleted successfully!`;
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

module.exports = new AnswerTaskController();
