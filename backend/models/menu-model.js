const { Schema, model } = require("mongoose");

const menuSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      unique: true,
    },
    breakfast: { type: String, required: true, trim: true },
    lunch: { type: String, required: true, trim: true },
    dinner: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = model("Menu", menuSchema);
