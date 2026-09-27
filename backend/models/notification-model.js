const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["menu", "availability-reminder"],
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    channel: {
      type: String,
      enum: ["in-app", "sms", "email", "push"],
      default: "in-app",
    },
    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

module.exports = model("Notification", notificationSchema);
