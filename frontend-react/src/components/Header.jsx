import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="navbar">
        <div className="container d-flex justify-content-center">
          <div className="h-free-shipping">
            Free shipping on orders over $50
          </div>
        </div>
      </div>

      <div className="navbar sub-navbar py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand">
            <img
              src="/icons/Hipster_NavLogo.svg"
              alt="Logo"
              style={{ maxHeight: "80px", width: "auto" }}
            />
          </Link>

          <div className="d-flex align-items-center gap-3">
            <select className="form-select" style={{ width: "90px" }}>
              <option>USD</option>
              <option>INR</option>
              <option>EUR</option>
            </select>

            <Link to="/cart" className="position-relative">
              <img
                src="/icons/Hipster_CartIcon.svg"
                alt="Cart"
                style={{ width: "32px" }}
              />
              <span
                className="cart-size-circle"
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-10px",
                }}
              >
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;