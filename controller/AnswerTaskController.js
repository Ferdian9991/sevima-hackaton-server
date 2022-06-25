const { validationResult } = require("express-validator");
const options = require("../config/options");
const answerTaskResolvers = require("../database/schema/AnswerTask/resolvers");
const auth = require("./actions/auth");

class AnswerTaskController {
  async getAnswerTask(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);
    let message = "";
    try {
      if (context.auth) {
        if (!errors.isEmpty()) {
          message = "Required parameters missing";
          options.responseMessage({
            res,
            statusCode: 400,
            auth: false,
            message,
          });
          throw new Error(message);
        }

        const params = req.body;
        const allAnswerTask = await answerTaskResolvers.getAnswerTasks(params);
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
    } catch (e) {
      options.responseMessage({
        res,
        statusCode: 400,
        auth: false,
        message: e.message,
      });
    }
  }

  async getOneAnswerTask(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);
    let message = "";
    try {
      if (context.auth) {
        if (!errors.isEmpty()) {
          message = "Required parameters missing";
          options.responseMessage({
            res,
            statusCode: 400,
            auth: false,
            message,
          });
          throw new Error(message);
        }

        const params = req.body;
        params["userId"] = context.user.id;
        const answerTask = await answerTaskResolvers.findByTaskId(params);
        message = "Successfully get answerTask!";
        options.responseMessage({
          res,
          statusCode: 200,
          auth: context.auth,
          message,
          data: answerTask,
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
    } catch (e) {
      options.responseMessage({
        res,
        statusCode: 400,
        auth: false,
        message: e.message,
      });
    }
  }

  async create(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);

    let message = "";
    let data = {};

    try {
      if (context.auth) {
        if (!errors.isEmpty()) {
          message = "Required parameters missing";
          options.responseMessage({
            res,
            statusCode: 400,
            auth: false,
            message,
          });
          throw new Error(message);
        }

        message = "Successfully registered a new answerTask!";
        const params = req.body;
        params["userId"] = context.user.id;
        if (!params.classCode)
          params.classCode = Math.random()
            .toString(36)
            .replace("0.", "" || "");

        const foundAnswerTask = await answerTaskResolvers.findByTaskId(params);

        if (!foundAnswerTask) {
          data = await answerTaskResolvers.create(params);
        } else {
          data = await answerTaskResolvers.update(foundAnswerTask.id, params);
        }

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
    } catch (e) {
      options.responseMessage({
        res,
        statusCode: 400,
        auth: false,
        message: e.message,
      });
    }
  }

  async update(req, res) {
    const errors = validationResult(req);
    const context = await auth.getContext(req);

    let message = "";

    if (context.auth) {
      try {
        if (!errors.isEmpty()) {
          message = "Required parameters missing";
          options.responseMessage({
            res,
            statusCode: 400,
            auth: false,
            message,
          });
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
      } catch (e) {
        options.responseMessage({
          res,
          statusCode: 400,
          auth: false,
          message: e.message,
        });
      }
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
