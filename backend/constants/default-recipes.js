const defaultRecipes = [
  {
    dishName: "Poha",
    ingredients: [
      { name: "Poha", quantityPerPerson: 0.08, unit: "kg" },
      { name: "Onion", quantityPerPerson: 0.02, unit: "kg" },
      { name: "Peanuts", quantityPerPerson: 0.01, unit: "kg" },
    ],
  },
  {
    dishName: "Upma",
    ingredients: [
      { name: "Rava", quantityPerPerson: 0.08, unit: "kg" },
      { name: "Mixed Vegetables", quantityPerPerson: 0.03, unit: "kg" },
    ],
  },
  {
    dishName: "Paratha",
    ingredients: [
      { name: "Wheat Flour", quantityPerPerson: 0.09, unit: "kg" },
      { name: "Oil", quantityPerPerson: 0.01, unit: "ltr" },
    ],
  },
  {
    dishName: "Aloo Paratha",
    ingredients: [
      { name: "Wheat Flour", quantityPerPerson: 0.09, unit: "kg" },
      { name: "Potato", quantityPerPerson: 0.08, unit: "kg" },
    ],
  },
  {
    dishName: "Idli Sambhar",
    ingredients: [
      { name: "Idli Batter", quantityPerPerson: 0.16, unit: "kg" },
      { name: "Dal", quantityPerPerson: 0.035, unit: "kg" },
      { name: "Vegetables", quantityPerPerson: 0.05, unit: "kg" },
    ],
  },
  {
    dishName: "Sandwich",
    ingredients: [
      { name: "Bread", quantityPerPerson: 2, unit: "pcs" },
      { name: "Vegetables", quantityPerPerson: 0.05, unit: "kg" },
    ],
  },
  {
    dishName: "Dosa",
    ingredients: [
      { name: "Dosa Batter", quantityPerPerson: 0.18, unit: "kg" },
      { name: "Potato", quantityPerPerson: 0.06, unit: "kg" },
    ],
  },
  {
    dishName: "Dal Rice",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.1, unit: "kg" },
      { name: "Dal", quantityPerPerson: 0.045, unit: "kg" },
    ],
  },
  {
    dishName: "Rajma Rice",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.1, unit: "kg" },
      { name: "Rajma", quantityPerPerson: 0.055, unit: "kg" },
    ],
  },
  {
    dishName: "Chole Rice",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.1, unit: "kg" },
      { name: "Chole", quantityPerPerson: 0.055, unit: "kg" },
    ],
  },
  {
    dishName: "Kadhi Rice",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.1, unit: "kg" },
      { name: "Curd", quantityPerPerson: 0.08, unit: "kg" },
      { name: "Besan", quantityPerPerson: 0.025, unit: "kg" },
    ],
  },
  {
    dishName: "Veg Pulao",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.11, unit: "kg" },
      { name: "Vegetables", quantityPerPerson: 0.07, unit: "kg" },
    ],
  },
  {
    dishName: "Chana Rice",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.1, unit: "kg" },
      { name: "Chana", quantityPerPerson: 0.055, unit: "kg" },
    ],
  },
  {
    dishName: "Special Thali",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.08, unit: "kg" },
      { name: "Wheat Flour", quantityPerPerson: 0.07, unit: "kg" },
      { name: "Dal", quantityPerPerson: 0.04, unit: "kg" },
      { name: "Vegetables", quantityPerPerson: 0.08, unit: "kg" },
    ],
  },
  {
    dishName: "Paneer",
    ingredients: [
      { name: "Paneer", quantityPerPerson: 0.07, unit: "kg" },
      { name: "Gravy Base", quantityPerPerson: 0.08, unit: "kg" },
    ],
  },
  {
    dishName: "Mix Veg",
    ingredients: [{ name: "Mixed Vegetables", quantityPerPerson: 0.14, unit: "kg" }],
  },
  {
    dishName: "Dal Roti",
    ingredients: [
      { name: "Dal", quantityPerPerson: 0.05, unit: "kg" },
      { name: "Wheat Flour", quantityPerPerson: 0.09, unit: "kg" },
    ],
  },
  {
    dishName: "Aloo Gobi",
    ingredients: [
      { name: "Potato", quantityPerPerson: 0.08, unit: "kg" },
      { name: "Cauliflower", quantityPerPerson: 0.07, unit: "kg" },
    ],
  },
  {
    dishName: "Dal Makhani",
    ingredients: [
      { name: "Black Dal", quantityPerPerson: 0.055, unit: "kg" },
      { name: "Cream", quantityPerPerson: 0.015, unit: "ltr" },
    ],
  },
  {
    dishName: "Veg Biryani",
    ingredients: [
      { name: "Rice", quantityPerPerson: 0.12, unit: "kg" },
      { name: "Vegetables", quantityPerPerson: 0.08, unit: "kg" },
    ],
  },
  {
    dishName: "Paneer Butter Masala",
    ingredients: [
      { name: "Paneer", quantityPerPerson: 0.075, unit: "kg" },
      { name: "Gravy Base", quantityPerPerson: 0.09, unit: "kg" },
      { name: "Butter", quantityPerPerson: 0.01, unit: "kg" },
    ],
  },
];

module.exports = defaultRecipes;
