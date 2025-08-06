import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Spline from "@splinetool/react-spline";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import "../css/AllRecipe.css";

const Allrecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const titleRef = useRef(null);
  const filterRef = useRef(null);
  const cardsRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch all recipes on page load
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/recipes/all-recipe", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  // ✅ Filter by category
  const handleCategoryFilter = async () => {
    if (!selectedCategory) return fetchRecipes();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/recipes/category/${selectedCategory}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipes(res.data);
    } catch (error) {
      console.error("Error fetching category recipes:", error);
      setRecipes([]);
    }
  };

  // ✅ Delete recipe
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this recipe?")) return;
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/recipes/delete-recipe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // ✅ GSAP Animations
  useEffect(() => {
    gsap.from(titleRef.current, {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power3.out",
    });

    gsap.from(filterRef.current, {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  useEffect(() => {
    if (cardsRef.current) {
      gsap.from(cardsRef.current.children, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
      });
    }
  }, [recipes]);

  // ✅ Navigate to recipe details page
  const goInfo = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="app-container">
      {/* Fullscreen Spline Background */}
      <div className="spline-bg">
        <Spline scene="https://prod.spline.design/9J7q0Z384ncepqdo/scene.splinecode" />
      </div>

      {/* Floating Glow Orbs */}
      <div className="glow-circle purple" />
      <div className="glow-circle blue" />
      <div className="glow-circle pink" />

      {/* Foreground Content */}
      <div className="content">
        <h2 ref={titleRef} className="title">🍽️ All Recipes</h2>

        {/* Category Filter */}
        <div ref={filterRef} className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Dessert">Dessert</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Beverage">Beverage</option>
          </select>
          <button onClick={handleCategoryFilter}>Filter</button>
        </div>

        {/* Recipe Cards */}
        {recipes.length === 0 ? (
          <p className="no-results">No recipes found.</p>
        ) : (
          <div ref={cardsRef} className="recipe-grid">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <div className="card-inner">
                  {/* Front Side */}
                  <div className="card-front">
                    <img
                      src={
                        recipe.image
                          ? `http://localhost:5000${recipe.image}`
                          : "https://via.placeholder.com/150"
                      }
                      alt={recipe.name}
                    />
                    <h3>{recipe.name}</h3>
                  </div>

                  {/* Back Side */}
                  <div className="card-back">
                    <h4>{recipe.name}</h4>
                    <p><strong>Category:</strong> {recipe.category}</p>
                    <p>
                      <strong>Ingredients:</strong>{" "}
                      {recipe.ingredients.slice(0, 3).join(", ")}
                      {recipe.ingredients.length > 3 && " ..."}
                    </p>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(recipe._id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => goInfo(recipe._id)}
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginTop: "10px",
                      }}
                    >
                      Get Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Allrecipe;
