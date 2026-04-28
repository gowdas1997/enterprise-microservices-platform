import Header from "../components/Header";
import Footer from "../components/Footer";

function AdminDashboardPage() {
  return (
    <>
      <Header />

      <main
        style={{
          backgroundColor: "#0b1020",
          color: "white",
          minHeight: "100vh",
          padding: "40px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ marginBottom: "40px", color: "#ef4444" }}>
            Admin Dashboard
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "25px",
            }}
          >
            {[
              "User Management",
              "Password Reset Control",
              "Product Management",
              "Order Management",
              "Inventory Management",
              "Security Logs",
            ].map((item) => (
              <div
                key={item}
                style={{
                  backgroundColor: "#111827",
                  padding: "30px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid #374151",
                }}
              >
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminDashboardPage;