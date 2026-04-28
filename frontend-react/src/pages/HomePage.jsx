import Header from "../components/Header";
import Footer from "../components/Footer";

const sampleProducts = [
  {
    id: 1,
    name: "VR Headset",
    price: "$120",
    image: "/images/VRHeadsets.png",
  },
  {
    id: 2,
    name: "Fashion Collection",
    price: "$90",
    image: "/images/folded-clothes-on-white-chair.jpg",
  },
  {
    id: 3,
    name: "Premium Style",
    price: "$150",
    image: "/images/folded-clothes-on-white-chair-wide.jpg",
  },
];

function HomePage() {
  return (
    <>
      <Header />

      <main
        style={{
          backgroundColor: "#0b1020",
          minHeight: "100vh",
          color: "white",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2>Hot Products</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            {sampleProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#111827",
                  padding: "20px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <a href={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </a>

                <h4 style={{ marginTop: "20px" }}>
                  {product.name}
                </h4>

                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginTop: "10px",
                  }}
                >
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;