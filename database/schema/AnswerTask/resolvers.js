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

  async findByClassCode(options) {
    try {
      const record = this.model
        .findOne({ classCode: options.classCode.trim() })
        .exec();

      return await record;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getAnswerTasks() {
    try {
      const record = this.model.find({}).sort({ _createdAt: -1 }).exec();

      return await record;
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
