import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Admin login successful");
    window.location.href = "/admin-dashboard";
  };

  return (
    <>
      <Header />

      <main
        style={{
          backgroundColor: "#111827",
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
            backgroundColor: "#1f2937",
            padding: "40px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
            border: "2px solid #ef4444",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            Admin Login
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              required
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              required
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
              Admin Login
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
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
};

export default AdminLoginPage;