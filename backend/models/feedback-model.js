const { Schema, model } = require("mongoose");

const feedbackSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    meal: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

feedbackSchema.index({ student: 1, date: 1, meal: 1 }, { unique: true });

module.exports = model("Feedback", feedbackSchema);
