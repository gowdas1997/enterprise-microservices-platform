import Header from "../components/Header";
import Footer from "../components/Footer";

const cartItems = [
  {
    id: 1,
    name: "VR Headset",
    price: 120,
    quantity: 1,
    image: "/images/VRHeadsets.png",
  },
  {
    id: 2,
    name: "Fashion Collection",
    price: 90,
    quantity: 2,
    image: "/images/folded-clothes-on-white-chair.jpg",
  },
];

function CartPage() {
  const shippingCost = 15;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingCost;

  return (
    <>
      <Header />

      <main
        style={{
          backgroundColor: "#0b1020",
          color: "white",
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "40px",
          }}
        >
          {/* Cart Summary */}
          <div>
            <h2>Cart ({cartItems.length})</h2>

            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "30px",
                  backgroundColor: "#111827",
                  padding: "20px",
                  borderRadius: "12px",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    <strong>
                      ${item.price * item.quantity}
                    </strong>
                  </p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: "30px" }}>
              <p>Shipping: ${shippingCost}</p>
              <h3>Total: ${total}</h3>
            </div>
          </div>

          {/* Checkout Form */}
          <div
            style={{
              backgroundColor: "#111827",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            <h2>Shipping Address</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "/order-confirmation";
              }}
            >
              <input
                type="email"
                placeholder="Email Address"
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Street Address"
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Zip Code"
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="City"
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="State"
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Country"
                required
                style={inputStyle}
              />

              <h3 style={{ marginTop: "30px" }}>
                Payment Method
              </h3>

              <input
                type="text"
                placeholder="Card Number"
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Expiry Month"
                required
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Expiry Year"
                required
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="CVV"
                required
                style={inputStyle}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "15px",
                  backgroundColor: "#e91e63",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  marginTop: "20px",
                  cursor: "pointer",
                }}
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "none",
};

export default CartPage;