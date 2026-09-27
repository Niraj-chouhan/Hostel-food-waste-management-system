const { Schema, model } = require("mongoose");

const mealAttendanceSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    status: {
      type: String,
      enum: ["coming", "not-coming"],
      required: true,
    },
  },
  { timestamps: true }
);

mealAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = model("MealAttendance", mealAttendanceSchema);
