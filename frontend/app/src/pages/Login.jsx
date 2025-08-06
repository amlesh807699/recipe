import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import "../css/Login.css"; // ✅ Import CSS

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      alert(res.data.message || "✅ Login Successful!");

      localStorage.setItem("token", res.data.token);
      setForm({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "❌ Login Failed");
    }
  };

  // ✅ GSAP animation on mount
  useEffect(() => {
    gsap.from(formRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, []);

  return (
    <div className="login-page">
      <motion.div
        ref={formRef}
        className="login-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="login-title"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome Back
        </motion.h2>

        <form onSubmit={handleSubmit} className="login-form">
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="login-input"
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
            className="login-input"
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          <motion.button
            type="submit"
            className="login-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
