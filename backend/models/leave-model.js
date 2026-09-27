const { Schema, model } = require("mongoose");

const leaveSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    toDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    reason: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

leaveSchema.index({ student: 1, fromDate: 1, toDate: 1 });

module.exports = model("Leave", leaveSchema);
