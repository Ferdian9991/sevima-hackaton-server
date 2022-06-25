const Builder = require("../../middleware/schema");

const ClassroomSchema = Builder.schema(
  {
    name: { type: String, default: "" },
    status: { type: String, default: "Online" },

    _createdAt: { type: String, default: "" },
    _updatedAt: { type: String, default: "" },
    _deletedAt: { type: String, default: "" },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    usePushEach: true,
    collection: "Classrooms",
  }
);

Builder.paginate(ClassroomSchema);

const Classroom = Builder.model("Classroom", ClassroomSchema);

module.exports = Classroom;
