const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const verifyToken = require("../middleware/auth");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


router.post("/suggest", verifyToken, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: "Please provide ingredients" });
    }

    const recipes = await Recipe.find({
      ingredients: { $in: ingredients.map((i) => i.toLowerCase()) },
    }).limit(5);

    let aiSuggestion = [];
    if (recipes.length < 3) {
      const prompt = `Suggest 3 recipes using these ingredients: ${ingredients.join(", ")}. Give short names only.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      });

      aiSuggestion = completion.choices[0].message.content
        .split("\n")
        .filter((line) => line.trim() !== "");
    }

    res.status(200).json({
      message: "AI recipe suggestions",
      dbRecipes: recipes,
      aiRecipes: aiSuggestion,
    });
  } catch (err) {
    console.error("AI Suggestion Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
