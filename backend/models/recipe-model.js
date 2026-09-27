const { Schema, model } = require("mongoose");

const ingredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantityPerPerson: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const recipeSchema = new Schema(
  {
    dishName: { type: String, required: true, trim: true, unique: true },
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: (ingredients) => ingredients.length > 0,
        message: "At least one ingredient is required.",
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Recipe", recipeSchema);
