import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spline from "@splinetool/react-spline";
import gsap from "gsap";

const AiSuggest = () => {
  const [ingredients, setIngredients] = useState("");
  const [dbRecipes, setDbRecipes] = useState([]);
  const [aiRecipes, setAiRecipes] = useState([]);

  // Refs for GSAP animations
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const dbRef = useRef(null);
  const aiRef = useRef(null);

  useEffect(() => {
    // Animate page elements on mount
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });
    gsap.from(formRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai/suggest",
        { ingredients: ingredients.split(",").map((item) => item.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDbRecipes(res.data.dbRecipes || []);
      setAiRecipes(res.data.aiRecipes || []);

      // Animate results after fetching
      setTimeout(() => {
        if (dbRef.current) {
          gsap.from(dbRef.current.children, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          });
        }
        if (aiRef.current) {
          gsap.from(aiRef.current.children, {
            opacity: 0,
            x: -20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          });
        }
      }, 200);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      alert(error.response?.data?.msg || "❌ Failed to fetch AI suggestions");
    }
  };

  return (
    <div className="app-container" style={{ position: "relative" }}>
      {/* ✅ Fullscreen Spline Background */}
      <div className="spline-bg">
        <Spline scene="https://prod.spline.design/9J7q0Z384ncepqdo/scene.splinecode" />
      </div>

      {/* ✅ Foreground Content */}
      <div className="content" style={{ padding: "40px", zIndex: 10 }}>
        <div
          className="form-container"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            ref={titleRef}
            style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}
          >
            🤖 AI Recipe Suggestions
          </h2>

          {/* Input Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="text"
              placeholder="Enter ingredients (comma separated)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                minWidth: "220px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            >
              Get Suggestions
            </button>
          </form>

          {/* Database Recipes */}
          {dbRecipes.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ color: "#fff" }}>🍲 Recipes from Database</h3>
              <div
                ref={dbRef}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "16px",
                  marginTop: "10px",
                }}
              >
                {dbRecipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      padding: "12px",
                      borderRadius: "10px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                      color: "#fff",
                      transition: "0.3s",
                    }}
                  >
                    {recipe.imageUrl && (
                      <img
                        src={`http://localhost:5000${recipe.imageUrl}`}
                        alt={recipe.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "10px",
                        }}
                      />
                    )}
                    <h4>{recipe.name}</h4>
                    <p style={{ fontSize: "14px", color: "#ddd" }}>
                      Ingredients: {recipe.ingredients.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {aiRecipes.length > 0 && (
            <div>
              <h3 style={{ color: "#fff" }}>🤖 AI Suggestions</h3>
              <ul
                ref={aiRef}
                style={{ marginTop: "10px", paddingLeft: "20px", color: "#fff" }}
              >
                {aiRecipes.map((recipe, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>
                    {recipe}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSuggest;
