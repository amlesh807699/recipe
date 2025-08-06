const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const verifyToken = require("../middleware/auth");
const multer = require("multer");

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ===============================
   ✅ Get All Recipes
================================*/
router.get("/all-recipe", verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ✅ Search Recipe
================================*/
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Please provide a search term" });
    }

    const recipes = await Recipe.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { ingredients: { $elemMatch: { $regex: query, $options: "i" } } },
      ],
    });

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ✅ Get Recipes by Category
================================*/
router.get("/category/:category", verifyToken, async (req, res) => {
  try {
    const { category } = req.params;
    const recipes = await Recipe.find({ category: { $regex: `^${category}$`, $options: "i" } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ✅ Add Recipe
================================*/
router.post("/add-recipe", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, ingredients, steps, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newRecipe = new Recipe({
      name,
      ingredients: ingredients.split(",").map((item) => item.trim()),
      steps,
      category,
      image, // ✅ consistent name
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ✅ Update Recipe
================================*/
router.put("/update-recipe/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, ingredients, steps, category } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (ingredients) updateData.ingredients = ingredients.split(",").map((i) => i.trim());
    if (steps) updateData.steps = steps;
    if (category) updateData.category = category;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });

    res.status(200).json({ message: "Recipe updated successfully", recipe: updatedRecipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ✅ Delete Recipe
================================*/
router.delete("/delete-recipe/:id", verifyToken, async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===============================
   ✅ Get One Recipe by ID
================================*/
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
