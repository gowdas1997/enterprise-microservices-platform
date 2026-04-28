import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function OTPVerificationPage() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Enter valid 6-digit OTP");
      return;
    }

    alert("Account verified successfully");
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
            OTP Verification
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
              Verify OTP
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

export default OTPVerificationPage;