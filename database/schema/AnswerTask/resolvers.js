const bcrypt = require("bcrypt-nodejs");
const AnswerTaskModels = require("./models");
const option = require("../../../config/options");

class AnswerTaskResolver {
  constructor(model) {
    this.model = AnswerTaskModels;
  }

  async findByName(options) {
    try {
      const record = this.model.findOne({ name: options.name }).exec();

      return await record;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async findById(options) {
    try {
      const record = this.model.findOne({ _id: options.id }).exec();

      return await record;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async findByTaskId(options) {
    try {
      const { taskId, userId } = options;
      const record = this.model.findOne({ taskId, userId }).exec();

      return await record;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getAnswerTasks(options) {
    try {
      const record = await this.model.aggregate([
        {
          $match: { taskId: options.taskId },
        },
        {
          $lookup: {
            from: "Users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $sort: { _createdAt: -1 } },
        {
          $project: {
            _id: 1,
            taskId: 1,
            userId: 1,
            content: 1,
            score: 1,
            _createdAt: 1,
            _updatedAt: 1,
            "user.username": 1,
            "user.fullname": 1,
            "user.classroomId": 1,
            "user.picture": 1,
          },
        },
      ]);

      return record;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async create(data) {
    try {
      const record = new this.model(data);
      const answerTask = await record.save();

      answerTask._createdAt = new Date().toISOString();
      answerTask._updatedAt = new Date().toISOString();

      const registerData = await answerTask.save();

      return await registerData;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async update(id, data) {
    try {
      const record = this.model.findOne({ _id: id }).exec();
      const answerTask = await record;
      Object.keys(data).map((field) => {
        answerTask[field] = data[field];
      });
      const update = await answerTask.save();

      return update;
    } catch (err) {
      return err;
    }
  }

  async delete(options) {
    try {
      const record = this.model.findOne({ _id: options.id }).exec();
      const answerTask = await record;
      answerTask.delete();
      return answerTask;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
module.exports = new AnswerTaskResolver();
