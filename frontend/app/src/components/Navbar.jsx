import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  // ✅ GSAP Animation on Mount
  useEffect(() => {
    // Navbar slide-in
    gsap.from(navRef.current, {
      y: -70,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Logo animation: Bounce + Subtle Float
    gsap.fromTo(
      logoRef.current,
      { scale: 0, rotate: -180, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 1.2, ease: "back.out(1.7)" }
    );

    // Infinite floating effect
    gsap.to(logoRef.current, {
      y: -5,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut",
      delay: 1.2,
    });
  }, []);

  return (
    <nav ref={navRef} className="navbar">
      {/* Animated Logo */}
      <Link to="/" className="logo" ref={logoRef}>
        🍽️ RecipeApp
      </Link>

      {/* Desktop Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-item">Home</Link>

        {token && (
          <>
            <Link to="/add-recipe" className="nav-item">Add Recipe</Link>
            <Link to="/ai-suggest" className="nav-item">AI Suggest</Link>
            <Link to="/all-recipes" className="nav-item">All Recipes</Link>
          </>
        )}

        {!token ? (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>

      {/* Hamburger for Mobile */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
};

export default Navbar;
