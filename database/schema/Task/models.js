const Builder = require("../../middleware/schema");

const TaskSchema = Builder.schema(
  {
    name: { type: String, default: "" },
    classroomId: { type: String, default: "" },
    mapel: { type: String, default: "" },
    content: { type: String, default: "" },

    _createdAt: { type: String, default: "" },
    _updatedAt: { type: String, default: "" },
    _deletedAt: { type: String, default: "" },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    usePushEach: true,
    collection: "Tasks",
  }
);

Builder.paginate(TaskSchema);

const Task = Builder.model("Task", TaskSchema);

module.exports = Task;
