const bcrypt = require("bcrypt-nodejs");
const TaskModels = require("./models");
const option = require("../../../config/options");

class TaskResolver {
  constructor(model) {
    this.model = TaskModels;
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

  async getTasks(params) {
    try {
      const record = this.model
        .find({ classroomId: params.classroomId })
        .sort({ _createdAt: -1 })
        .exec();

      return await record;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async create(data) {
    try {
      const record = new this.model(data);
      const task = await record.save();

      task._createdAt = new Date().toISOString();
      task._updatedAt = new Date().toISOString();

      const registerData = await task.save();

      return await registerData;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async update(id, data) {
    try {
      const record = this.model.findOne({ _id: id }).exec();
      const task = await record;
      Object.keys(data).map((field) => {
        task[field] = data[field];
      });
      const update = await task.save();

      return update;
    } catch (err) {
      return err;
    }
  }

  async delete(options) {
    try {
      const record = this.model.findOne({ _id: options.id }).exec();
      const task = await record;
      task.delete();
      return task;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
module.exports = new TaskResolver();
