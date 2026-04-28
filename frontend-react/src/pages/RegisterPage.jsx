import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("OTP sent to your email for verification");
    window.location.href = "/verify-otp";
  };

  return (
    <>
      <Header />

      <main
        style={{
          backgroundColor: "#0b1020",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#111827",
            padding: "40px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            Register
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Valid Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
              Register
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#e91e63",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
};

export default RegisterPage;