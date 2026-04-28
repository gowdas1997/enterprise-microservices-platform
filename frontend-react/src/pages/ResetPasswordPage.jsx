import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    otp: "",
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

    alert("Password reset successful");
    window.location.href = "/login";
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
            Reset Password
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              required
              value={formData.otp}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="New Password"
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
              Reset Password
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
  backgroundColor: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
};

export default ResetPasswordPage;