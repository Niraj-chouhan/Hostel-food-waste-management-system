const User = require("../models/user-model");
const MealAttendance = require("../models/meal-attendance-model");
const Menu = require("../models/menu-model");
const Recipe = require("../models/recipe-model");
const defaultMenu = require("../constants/default-menu");
const defaultRecipes = require("../constants/default-recipes");

// Weekday names in JavaScript date order.
const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Check YYYY-MM-DD date format.
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date || "");

// Convert Date object to YYYY-MM-DD.
const toDateKey = (date) => date.toISOString().slice(0, 10);

// Find weekday name from YYYY-MM-DD date.
const getDayName = (dateKey) => dayOrder[new Date(`${dateKey}T00:00:00.000Z`).getUTCDay()];

// Build all dates between two dates.
const getDatesBetween = (fromDate, toDate) => {
  const dates = [];
  const cursor = new Date(`${fromDate}T00:00:00.000Z`);
  const end = new Date(`${toDate}T00:00:00.000Z`);

  while (cursor <= end) {
    dates.push(toDateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
};

// Add default menu once when menu collection is empty.
const seedDefaultMenu = async () => {
  const existingCount = await Menu.countDocuments();
  if (existingCount === 0) {
    await Menu.insertMany(defaultMenu, { ordered: false });
  }
};

// Add default recipes once when recipe collection is empty.
const seedDefaultRecipes = async () => {
  const existingCount = await Recipe.countDocuments();
  if (existingCount === 0) {
    await Recipe.insertMany(defaultRecipes, { ordered: false });
  }
};

// Get weekly menu in Monday to Sunday order.
const getWeeklyMenu = async () => {
  await seedDefaultMenu();
  const menu = await Menu.find().lean();
  const order = new Map(defaultMenu.map((item, index) => [item.day, index]));
  return menu.sort((a, b) => order.get(a.day) - order.get(b.day));
};

// Get menu row for a selected date.
const getMenuForDate = async (date) => {
  const weeklyMenu = await getWeeklyMenu();
  const day = getDayName(date);
  return weeklyMenu.find((item) => item.day === day) || null;
};

// Get all students and their availability for one date.
const getStudentAttendanceForDate = async (date) => {
  const students = await User.find(
    { isAdmin: false, role: { $ne: "cook" } },
    { username: 1, email: 1, phone: 1 }
  ).lean();

  const records = await MealAttendance.find({
    date,
    student: { $in: students.map((student) => student._id) },
  }).lean();

  const statusByStudent = new Map(
    records.map((record) => [record.student.toString(), record.status])
  );

  const normalizedStudents = students.map((student) => {
    const status = statusByStudent.get(student._id.toString());
    return {
      ...student,
      status: status || "not-coming",
      responseStatus: status ? "submitted" : "fallback-not-coming",
    };
  });

  const coming = normalizedStudents.filter((student) => student.status === "coming");
  const notComing = normalizedStudents.filter((student) => student.status === "not-coming");

  return {
    students: normalizedStudents,
    coming,
    notComing,
    summary: {
      totalStudents: normalizedStudents.length,
      comingStudents: coming.length,
      notComingStudents: notComing.length,
      missingResponses: normalizedStudents.filter(
        (student) => student.responseStatus === "fallback-not-coming"
      ).length,
    },
  };
};

// Create empty attendance bucket for analytics.
const createAttendanceBucket = () => ({ coming: 0, notComing: 0, submitted: 0 });

// Add one attendance record into date bucket.
const addRecordToDateBucket = (recordsByDate, record) => {
  const bucket = recordsByDate.get(record.date) || createAttendanceBucket();
  bucket[record.status === "coming" ? "coming" : "notComing"] += 1;
  bucket.submitted += 1;
  recordsByDate.set(record.date, bucket);
};

// Group attendance records by date.
const groupRecordsByDate = (records) => {
  const recordsByDate = new Map();
  records.forEach((record) => addRecordToDateBucket(recordsByDate, record));
  return recordsByDate;
};

// Build one daily analytics row.
const buildDailyAnalyticsRow = ({ date, bucket, totalStudents }) => ({
  date,
  day: getDayName(date),
  totalStudents,
  comingStudents: bucket.coming,
  notComingStudents: totalStudents - bucket.coming,
  submittedResponses: bucket.submitted,
  missingResponses: Math.max(totalStudents - bucket.submitted, 0),
  participationRate: totalStudents ? roundQuantity((bucket.submitted / totalStudents) * 100) : 0,
});

// Build all daily analytics rows.
const buildDailyAnalytics = ({ dates, recordsByDate, totalStudents }) => {
  return dates.map((date) => {
    const bucket = recordsByDate.get(date) || createAttendanceBucket();
    return buildDailyAnalyticsRow({ date, bucket, totalStudents });
  });
};

// Add one day into analytics totals.
const addDailyRowToTotals = (totals, item) => ({
  comingStudents: totals.comingStudents + item.comingStudents,
  missingResponses: totals.missingResponses + item.missingResponses,
  submittedResponses: totals.submittedResponses + item.submittedResponses,
});

// Calculate total submitted, missing and coming counts.
const calculateAnalyticsTotals = (daily) => {
  return daily.reduce(addDailyRowToTotals, {
    comingStudents: 0,
    missingResponses: 0,
    submittedResponses: 0,
  });
};

// Add one day into weekday trend.
const addDailyRowToWeekdayTrend = (trend, item) => {
  const current = trend[item.day] || { days: 0, comingStudents: 0 };
  current.days += 1;
  current.comingStudents += item.comingStudents;
  trend[item.day] = current;
  return trend;
};

// Calculate average attendance for each weekday.
const calculateWeekdayTrend = (daily) => {
  const weekdayTrend = daily.reduce(addDailyRowToWeekdayTrend, {});

  return Object.entries(weekdayTrend).map(([day, value]) => ({
    day,
    averageComing: roundQuantity(value.comingStudents / value.days),
  }));
};

// Keep ingredient numbers easy to read.
const roundQuantity = (quantity) => Number(quantity.toFixed(3));

// Convert menu row into breakfast/lunch/dinner dish list.
const getMealSlots = (menu) => {
  return [
    { meal: "breakfast", dishName: menu.breakfast },
    { meal: "lunch", dishName: menu.lunch },
    { meal: "dinner", dishName: menu.dinner },
  ];
};

// Get recipes and make dishName based lookup map.
const getRecipeMap = async (mealSlots) => {
  const recipes = await Recipe.find({
    dishName: { $in: mealSlots.map((slot) => slot.dishName) },
  }).lean();

  return new Map(recipes.map((recipe) => [recipe.dishName, recipe]));
};

// Add one ingredient quantity into final total list.
const addIngredientToTotals = (totals, ingredient, requiredQuantity) => {
  const key = `${ingredient.name.toLowerCase()}|${ingredient.unit.toLowerCase()}`;
  const existing = totals.get(key) || {
    name: ingredient.name,
    unit: ingredient.unit,
    requiredQuantity: 0,
  };

  existing.requiredQuantity = roundQuantity(existing.requiredQuantity + requiredQuantity);
  totals.set(key, existing);
};

// Calculate all ingredients of one dish.
const calculateDishIngredients = ({ recipe, peopleCount, totals }) => {
  return recipe.ingredients.map((ingredient) => {
    const requiredQuantity = roundQuantity(ingredient.quantityPerPerson * peopleCount);
    addIngredientToTotals(totals, ingredient, requiredQuantity);

    return {
      name: ingredient.name,
      unit: ingredient.unit,
      quantityPerPerson: ingredient.quantityPerPerson,
      requiredQuantity,
    };
  });
};

// Calculate shopping list for breakfast, lunch and dinner.
const buildShoppingList = async ({ menu, peopleCount }) => {
  await seedDefaultRecipes();

  if (!menu) {
    return { meals: [], totals: [], missingRecipes: [] };
  }

  const mealSlots = getMealSlots(menu);
  const recipeByDish = await getRecipeMap(mealSlots);
  const totals = new Map();
  const missingRecipes = [];

  const meals = mealSlots.map((slot) => {
    const recipe = recipeByDish.get(slot.dishName);
    if (!recipe) {
      missingRecipes.push(slot.dishName);
      return { ...slot, ingredients: [], recipeAvailable: false };
    }

    const ingredients = calculateDishIngredients({ recipe, peopleCount, totals });

    return { ...slot, ingredients, recipeAvailable: true };
  });

  return {
    meals,
    totals: Array.from(totals.values()).sort((a, b) => a.name.localeCompare(b.name)),
    missingRecipes,
  };
};

// Build full cook response: attendance + menu + ingredient quantity.
const getCookMealPlan = async (date) => {
  const attendance = await getStudentAttendanceForDate(date);
  const menu = await getMenuForDate(date);
  const shoppingList = await buildShoppingList({
    menu,
    peopleCount: attendance.summary.comingStudents,
  });

  return {
    date,
    menu,
    summary: attendance.summary,
    coming: attendance.coming,
    notComing: attendance.notComing,
    shoppingList,
  };
};

// Build date-wise attendance history for analytics screen.
const getAttendanceAnalytics = async (fromDate, toDate) => {
  const dates = getDatesBetween(fromDate, toDate);
  const totalStudents = await User.countDocuments({ isAdmin: false, role: { $ne: "cook" } });
  const records = await MealAttendance.find({ date: { $in: dates } }).lean();
  const recordsByDate = groupRecordsByDate(records);
  const daily = buildDailyAnalytics({
    dates,
    recordsByDate,
    totalStudents,
  });

  const totals = calculateAnalyticsTotals(daily);
  const averageComing = daily.length ? roundQuantity(totals.comingStudents / daily.length) : 0;

  return {
    fromDate,
    toDate,
    totalStudents,
    averageComing,
    missingResponses: totals.missingResponses,
    submittedResponses: totals.submittedResponses,
    daily,
    weekdayTrend: calculateWeekdayTrend(daily),
  };
};

module.exports = {
  buildShoppingList,
  getAttendanceAnalytics,
  getCookMealPlan,
  getDatesBetween,
  getMenuForDate,
  getWeeklyMenu,
  isValidDate,
  seedDefaultMenu,
  seedDefaultRecipes,
};
