const { validationResult } = require("express-validator");
const options = require("../config/options");
const taskResolver = require("../database/schema/Task/resolvers");
const auth = require("./actions/auth");

class TaskController {
  async getTask(req, res) {
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
      const allTasks = await taskResolver.getTasks(params);
      message = "Successfully get task!";
      options.responseMessage({
        res,
        statusCode: 200,
        auth: context.auth,
        message,
        data: allTasks,
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

        message = "Successfully registered a new task!";
        const params = req.body;
        params["userId"] = context.user.id;
        if (!params.classCode)
          params.classCode = Math.random()
            .toString(36)
            .replace("0.", "" || "");

        const data = await taskResolver.create(params);

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
      if (!errors.isEmpty()) {
        message = "Required parameters missing";
        options.responseMessage({ res, statusCode: 400, auth: false, message });
        throw new Error(message);
      }

      const params = req.body;

      const foundTask = await taskResolver.findById(params);

      if (!foundTask) {
        message = `Cannot find task id ${params.id}`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await taskResolver.update(params.id, params);

      message = `task updated successfully!`;
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

      const foundTask = await taskResolver.findById(params);

      if (!foundTask) {
        message = `Cannot find task id ${params.id}`;
        options.responseMessage({
          res,
          statusCode: 400,
          auth: context.auth,
          message,
        });
        throw new Error(message);
      }

      const data = await taskResolver.delete(params);

      message = `task deleted successfully!`;
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

module.exports = new TaskController();
