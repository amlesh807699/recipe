import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spline from "@splinetool/react-spline";
import gsap from "gsap";

const AddRecipe = () => {
  const [form, setForm] = useState({
    name: "",
    ingredients: "",
    steps: "",
    category: "Snack",
  });
  const [image, setImage] = useState(null);

  // Refs for animation
  const cardRef = useRef(null);
  const circlesRef = useRef([]);
  const inputsRef = useRef([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("ingredients", form.ingredients);
    formData.append("steps", form.steps);
    formData.append("category", form.category);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/recipes/add-recipe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Recipe added successfully!");
      setForm({ name: "", ingredients: "", steps: "", category: "Snack" });
      setImage(null);
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("❌ Failed to add recipe");
    }
  };

  // GSAP Animations
  useEffect(() => {
    // Animate Card
    gsap.from(cardRef.current, {
      duration: 1,
      opacity: 0,
      y: 100,
      ease: "power4.out",
    });

    // Animate Circles
    gsap.to(circlesRef.current, {
      y: 30,
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: "sine.inOut",
      stagger: 0.3,
    });

    // Animate Inputs
    gsap.from(inputsRef.current, {
      duration: 0.8,
      opacity: 0,
      x: -50,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* ✅ Fullscreen Spline Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: -10, pointerEvents: "none" }}>
        <Spline scene="https://prod.spline.design/9J7q0Z384ncepqdo/scene.splinecode" />
      </div>

      {/* ✅ Centered Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div
          ref={cardRef}
          style={{
            maxWidth: "420px",
            width: "100%",
            position: "relative",
            background: "rgba(31, 41, 55, 0.85)",
            padding: "32px",
            borderRadius: "16px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Circles */}
          <div
            ref={(el) => (circlesRef.current[0] = el)}
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#9333ea",
              borderRadius: "50%",
              filter: "blur(40px)",
              position: "absolute",
              top: "-30px",
              left: "-30px",
              zIndex: -1,
              opacity: 0.7,
            }}
          />
          <div
            ref={(el) => (circlesRef.current[1] = el)}
            style={{
              width: "150px",
              height: "150px",
              backgroundColor: "#38bdf8",
              borderRadius: "50%",
              filter: "blur(40px)",
              position: "absolute",
              bottom: "-40px",
              right: "-40px",
              zIndex: -1,
              opacity: 0.7,
            }}
          />

          <h2 style={{ fontSize: "26px", fontWeight: "bold", color: "white", textAlign: "center", marginBottom: "24px" }}>
            ✨ Add New Recipe
          </h2>

          <form onSubmit={handleSubmit}>
            {[
              { label: "Recipe Name", name: "name", type: "text" },
              { label: "Ingredients", name: "ingredients", type: "textarea" },
              { label: "Cooking Steps", name: "steps", type: "textarea" },
            ].map((field, idx) => (
              <div key={idx} style={{ marginBottom: "16px" }} ref={(el) => (inputsRef.current[idx] = el)}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#d1d5db" }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    rows="3"
                    style={{
                      marginTop: "4px",
                      padding: "10px",
                      width: "100%",
                      backgroundColor: "rgba(55, 65, 81, 0.9)",
                      border: "1px solid #4b5563",
                      borderRadius: "8px",
                      color: "white",
                      outline: "none",
                      transition: "0.3s",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #9333ea")}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    style={{
                      marginTop: "4px",
                      padding: "10px",
                      width: "100%",
                      backgroundColor: "rgba(55, 65, 81, 0.9)",
                      border: "1px solid #4b5563",
                      borderRadius: "8px",
                      color: "white",
                      outline: "none",
                      transition: "0.3s",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #3b82f6")}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                )}
              </div>
            ))}

            {/* Category Select */}
            <div style={{ marginBottom: "16px" }} ref={(el) => (inputsRef.current[3] = el)}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#d1d5db" }}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{
                  marginTop: "4px",
                  padding: "10px",
                  width: "100%",
                  backgroundColor: "rgba(55, 65, 81, 0.9)",
                  border: "1px solid #4b5563",
                  borderRadius: "8px",
                  color: "white",
                  outline: "none",
                  transition: "0.3s",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 10px #38bdf8")}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
                <option>Dessert</option>
                <option>Beverage</option>
              </select>
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: "24px" }} ref={(el) => (inputsRef.current[4] = el)}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#d1d5db" }}>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{
                  marginTop: "4px",
                  color: "#d1d5db",
                  cursor: "pointer",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="submit"
                style={{
                  background: "linear-gradient(to right, #9333ea, #a855f7, #3b82f6)",
                  color: "white",
                  padding: "12px 20px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "none",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Add Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
