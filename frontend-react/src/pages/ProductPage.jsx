import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const products = [
  {
    id: "1",
    name: "VR Headset",
    price: "$120",
    image: "/images/VRHeadsets.png",
    description:
      "Premium VR headset for immersive gaming and virtual experiences.",
  },
  {
    id: "2",
    name: "Fashion Collection",
    price: "$90",
    image: "/images/folded-clothes-on-white-chair.jpg",
    description:
      "Elegant modern fashion collection designed for style and comfort.",
  },
  {
    id: "3",
    name: "Premium Style",
    price: "$150",
    image: "/images/folded-clothes-on-white-chair-wide.jpg",
    description:
      "Premium apparel collection for enterprise-level lifestyle branding.",
  },
];

function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <h2 style={{ color: "white" }}>Product not found</h2>;
  }

  return (
    <>
      <Header />

      <main
        style={{
          backgroundColor: "#0b1020",
          color: "white",
          minHeight: "100vh",
          padding: "50px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                borderRadius: "12px",
              }}
            />
          </div>

          <div>
            <h1>{product.name}</h1>

            <h2 style={{ margin: "20px 0" }}>
              {product.price}
            </h2>

            <p style={{ marginBottom: "30px" }}>
              {product.description}
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label>Quantity: </label>

              <select
                style={{
                  padding: "10px",
                  marginLeft: "10px",
                }}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <button
              style={{
                padding: "15px 30px",
                backgroundColor: "#e91e63",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProductPage;