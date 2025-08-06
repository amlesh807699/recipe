import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spline from "@splinetool/react-spline";
import gsap from "gsap";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import "../css/Home.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // <-- create navigate function

  // Refs for GSAP animations
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchBoxRef = useRef(null);
  const resultsRef = useRef(null);

  // Fetch recipes by search term (name, ingredients, or category)
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/recipes/search?query=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
    } catch (error) {
      console.error("Error searching recipes:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // GSAP Animations on page load
  useEffect(() => {
    gsap.from(titleRef.current, {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power3.out",
    });
    gsap.from(subtitleRef.current, {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power3.out",
      delay: 0.3,
    });
    gsap.from(searchBoxRef.current, {
      duration: 1,
      scale: 0.8,
      opacity: 0,
      ease: "back.out(1.7)",
      delay: 0.6,
    });
  }, []);

  // Animate results whenever new ones are fetched
  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      gsap.from(resultsRef.current.children, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [results]);

  return (
    <div className="app-container">
      {/* Fullscreen Spline Background */}
      <div className="spline-bg">
        <Spline scene="https://prod.spline.design/9J7q0Z384ncepqdo/scene.splinecode" />
      </div>

      {/* Floating glowing background elements */}
      <div className="glow-circle purple" />
      <div className="glow-circle blue" />

      {/* Foreground Content */}
      <div className="content">
        <h1 ref={titleRef} className="title">
          🍽️ Recipe Book
        </h1>
        <p ref={subtitleRef} className="subtitle">
          Search and discover your favorite recipes
        </p>

        {/* Search Input */}
        <div ref={searchBoxRef} className="search-box">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Search Results */}
        <div className="results-section">
          {loading && <p className="loading">Searching recipes...</p>}
          {!loading && results.length > 0 && (
            <div ref={resultsRef} className="results-grid">
              {results.map((recipe) => (
                <div key={recipe._id} className="recipe-card">
                  <img
                    src={`http://localhost:5000${recipe.imageUrl || "/uploads/default.jpg"}`}
                    alt={recipe.name}
                  />
                  <h3>{recipe.name}</h3>
                  <p className="category">{recipe.category}</p>

                  {/* Get Info Button */}
                  <button
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="info-btn"
                    style={{
                      padding: "6px 12px",
                      marginTop: "8px",
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
                  >
                    Get Info
                  </button>
                </div>
              ))}
            </div>
          )}
          {!loading && results.length === 0 && searchTerm && (
            <p className="no-results">No recipes found for "{searchTerm}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
