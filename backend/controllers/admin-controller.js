const User = require("../models/user-model");
const Contact = require("../models/contact-model");
const Service = require("../models/services-model");
const {
  listMenu,
  listRecipes,
  saveMenuForDay,
  saveRecipe,
} = require("../services/admin-meal-service");

// Check if menu payload has breakfast, lunch and dinner.
const hasCompleteMenu = ({ breakfast, lunch, dinner }) => {
  return Boolean(breakfast && lunch && dinner);
};

// Check if recipe payload has dish name and ingredients.
const hasValidRecipe = ({ dishName, ingredients }) => {
  return Boolean(dishName && Array.isArray(ingredients) && ingredients.length > 0);
};

// Get all users without password field.
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users available" });
    }

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get one user by id.
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id }, { password: 0 });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update one user by id.
const updateUserById = async (req, res, next) => {
  try {
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Delete one user by id.
const deleteUserById = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get all contact messages.
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

// Delete one contact message by id.
const deleteContactById = async (req, res, next) => {
  try {
    await Contact.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: "contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get weekly menu from database.
const getMenu = async (req, res, next) => {
  try {
    const menu = await listMenu();
    return res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

// Update menu for one weekday.
const updateMenuByDay = async (req, res, next) => {
  try {
    const day = req.params.day;
    const { breakfast, lunch, dinner } = req.body;

    if (!hasCompleteMenu({ breakfast, lunch, dinner })) {
      return res.status(400).json({
        message: "Breakfast, lunch and dinner are required.",
      });
    }

    const menu = await saveMenuForDay(day, { breakfast, lunch, dinner });

    return res.status(200).json({
      message: `${day} menu updated successfully.`,
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

// Get all recipes for quantity calculation.
const getRecipes = async (req, res, next) => {
  try {
    const recipes = await listRecipes();
    return res.status(200).json(recipes);
  } catch (error) {
    next(error);
  }
};

// Create or update one dish recipe.
const upsertRecipe = async (req, res, next) => {
  try {
    const { dishName, ingredients } = req.body;

    if (!hasValidRecipe({ dishName, ingredients })) {
      return res.status(400).json({
        message: "Dish name and ingredients are required.",
      });
    }

    const recipe = await saveRecipe({ dishName, ingredients });

    return res.status(200).json({
      message: "Recipe saved successfully.",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// Get all services.
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find();
    return res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteContactById,
  deleteUserById,
  getAllUsers,
  getContacts,
  getMenu,
  getRecipes,
  getServices,
  getUserById,
  updateMenuByDay,
  updateUserById,
  upsertRecipe,
};
