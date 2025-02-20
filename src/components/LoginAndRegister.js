import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const LoginAndRegister = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? `${process.env.REACT_APP_BACKEND_URL}/login` : `${process.env.REACT_APP_BACKEND_URL}/signup`;
      const payload = isLogin ? { email, password } : { username, email, password };
  
      const { data } = await axios.post(url, payload);
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      
      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
  
      // Set timeout to clear the error message after 10 seconds
      setTimeout(() => {
        setError("");
      }, 10000);
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div> {/* Black Transparent Layer */}
        <div style={styles.content}>
          <h1>{isLogin ? "Login" : "Signup"}</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!isLogin && (
              <input
                required  
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>{isLogin ? "Login" : "Signup"}</button>
          </form>
          <p style={styles.toggleText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)} style={styles.toggleLink}>
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>
  );
};


const styles = {
  container: {
    position: "relative",
    color: "#ffffff",
    textAlign: "center",
    backgroundImage: `url(${require("../assets/images/login_bg.jpg")})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Ensure no extra content spills out
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Black with 50% opacity
    zIndex: 1, // Ensures it appears over the background
  },
  content: {
    position: "relative",
    zIndex: 2, // Ensures content appears above the overlay
  },
  
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  toggleText: {
    marginTop: "10px",
  },
  toggleLink: {
    color: "#007BFF",
    cursor: "pointer",
  },
};

export default LoginAndRegister;
