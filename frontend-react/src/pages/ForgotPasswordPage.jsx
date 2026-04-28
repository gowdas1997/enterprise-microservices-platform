import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Password reset OTP sent to your email");
    window.location.href = "/reset-password";
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
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Registered Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
              Send Reset OTP
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
  backgroundColor: "#f59e0b",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
};

export default ForgotPasswordPage;