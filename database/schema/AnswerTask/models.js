const Builder = require("../../middleware/schema");

const AnswerTaskSchema = Builder.schema(
  {
    taskId: { type: String, default: "" },
    userId: { type: String, default: "" },
    content: { type: String, default: "" },
    score: { type: String, default: "" },

    _createdAt: { type: String, default: "" },
    _updatedAt: { type: String, default: "" },
    _deletedAt: { type: String, default: "" },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    usePushEach: true,
    collection: "AnswerTasks",
  }
);

Builder.paginate(AnswerTaskSchema);

const AnswerTask = Builder.model("AnswerTask", AnswerTaskSchema);

module.exports = AnswerTask;
