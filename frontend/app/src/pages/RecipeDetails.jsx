import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spline from "@splinetool/react-spline";
import gsap from "gsap";
import "../css/RecipeDetails.css";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipe(res.data);
      } catch (err) {
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        duration: 1,
        y: 40,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3,
      });
    }
  }, [recipe]);

  if (loading)
    return (
      <p style={{ color: "#333", textAlign: "center", marginTop: "30vh" }}>
        Loading recipe...
      </p>
    );
  if (error)
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "30vh" }}>
        {error}
      </p>
    );
  if (!recipe)
    return (
      <p style={{ color: "#333", textAlign: "center", marginTop: "30vh" }}>
        Recipe not found.
      </p>
    );

  return (
    <div className="app-container">
      {/* Background */}
      <div className="spline-background">
        <Spline scene="https://prod.spline.design/9J7q0Z384ncepqdo/scene.splinecode" />
      </div>

      <div className="recipe-details-wrapper" ref={containerRef}>
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ← Back
        </button>

        {/* Image with fixed size */}
        {recipe.imageUrl && (
          <img
            src={`http://localhost:5000${recipe.imageUrl}`}
            alt={recipe.name}
            className="recipe-image-fixed"
          />
        )}

        {/* Text info below image */}
        <h1 className="recipe-title">{recipe.name}</h1>

        <p className="recipe-category">
          <strong>Category:</strong> {recipe.category}
        </p>

        <h3 className="section-title">Ingredients</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h3 className="section-title">Steps</h3>
        <p className="recipe-steps">{recipe.steps}</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
