import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function OrderConfirmationPage() {
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
            padding: "50px",
            borderRadius: "16px",
            textAlign: "center",
            maxWidth: "700px",
            width: "100%",
          }}
        >
          <h1
            style={{
              color: "#22c55e",
              marginBottom: "20px",
            }}
          >
            Order Successfully Placed!
          </h1>

          <p
            style={{
              fontSize: "20px",
              marginBottom: "30px",
            }}
          >
            Thank you for shopping with Enterprise Microservices Platform.
          </p>

          <p
            style={{
              marginBottom: "40px",
            }}
          >
            Your order has been confirmed and will be processed shortly.
          </p>

          <Link
            to="/"
            style={{
              padding: "15px 30px",
              backgroundColor: "#e91e63",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "18px",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default OrderConfirmationPage;