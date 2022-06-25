const bcrypt = require("bcrypt-nodejs");
const ClassroomModels = require("./models");
const option = require("../../../config/options");

class ClassroomResolver {
  constructor(model) {
    this.model = ClassroomModels;
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

  async getClassrooms() {
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
      const classroom = await record.save();

      classroom._createdAt = new Date().toISOString();
      classroom._updatedAt = new Date().toISOString();

      const registerData = await classroom.save();

      return await registerData;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async update(id, data) {
    try {
      const record = this.model.findOne({ _id: id }).exec();
      const classroom = await record;
      Object.keys(data).map((field) => {
        classroom[field] = data[field];
      });
      const update = await classroom.save();

      return update;
    } catch (err) {
      return err;
    }
  }

  async delete(options) {
    try {
      const record = this.model.findOne({ _id: options.id }).exec();
      const classroom = await record;
      classroom.delete();
      return classroom;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
module.exports = new ClassroomResolver();
