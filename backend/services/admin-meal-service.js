const Menu = require("../models/menu-model");
const Recipe = require("../models/recipe-model");
const { getWeeklyMenu, seedDefaultRecipes } = require("./meal-planning-service");

// Get full weekly menu from database.
const listMenu = () => {
  return getWeeklyMenu();
};

// Save breakfast, lunch and dinner for one weekday.
const saveMenuForDay = (day, meals) => {
  return Menu.findOneAndUpdate(
    { day },
    {
      breakfast: meals.breakfast,
      lunch: meals.lunch,
      dinner: meals.dinner,
    },
    { new: true, upsert: true, runValidators: true }
  );
};

// Get all recipes with default recipes created if DB is empty.
const listRecipes = async () => {
  await seedDefaultRecipes();
  return Recipe.find().sort({ dishName: 1 });
};

// Create or update recipe for one dish.
const saveRecipe = ({ dishName, ingredients }) => {
  return Recipe.findOneAndUpdate(
    { dishName },
    { dishName, ingredients },
    { new: true, upsert: true, runValidators: true }
  );
};

module.exports = {
  listMenu,
  listRecipes,
  saveMenuForDay,
  saveRecipe,
};
