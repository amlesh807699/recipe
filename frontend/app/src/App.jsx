import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddRecipe from "./pages/AddRecipe";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AiSuggest from "./pages/AiSuggest";
import Allrecipe from "./pages/Allrecipe";
import RecipeDetails from "./pages/RecipeDetails";
import "./App.css";

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Protected Home */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route path="/all-recipes" element={<Allrecipe />} />

          {/* Protected Routes */}
          <Route
            path="/add-recipe"
            element={
              <PrivateRoute>
                <AddRecipe />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-suggest"
            element={
              <PrivateRoute>
                <AiSuggest />
              </PrivateRoute>
            }
          />

          {/* Recipe Details Route */}
          <Route path="/recipe/:id" element={<RecipeDetails />} />

          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
