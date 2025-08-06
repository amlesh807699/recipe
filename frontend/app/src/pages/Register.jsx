import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import "../css/Register.css"; // ✅ Import CSS

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      alert(res.data.message || "✅ Registered Successfully!");
      setForm({ username: "", email: "", password: "" });
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "❌ Registration Failed");
    }
  };

  // ✅ GSAP entrance animation
  useEffect(() => {
    gsap.from(formRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, []);

  return (
    <div className="register-page">
      <motion.div
        ref={formRef}
        className="register-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="register-title"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Create Account
        </motion.h2>

        <form onSubmit={handleSubmit} className="register-form">
          <motion.input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="register-input"
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="register-input"
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="register-input"
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          <motion.button
            type="submit"
            className="register-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
