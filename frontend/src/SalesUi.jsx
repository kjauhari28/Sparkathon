import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SalesUi.css";

// Mock product data
const products = [
  { id: 1, name: "Milk", price: 40, discount: 20, expiry: "in 3 days" },
  { id: 2, name: "Bread", price: 30, discount: 20, expiry: "in 2 days" },
  { id: 3, name: "Chips", price: 50, discount: 0, expiry: "fresh" },
  { id: 4, name: "Butter", price: 70, discount: 10, expiry: "in 5 days" },
  { id: 5, name: "Yogurt", price: 25, discount: 15, expiry: "in 2 days" },
];

const SalesUI = () => {
  const navigate = useNavigate();
  const [view, setView] = useState(null);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sales-wrapper">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Stores
      </button>
      <h3>🧾 Sales Dashboard</h3>

      <div className="button-group">
        <button className="action-button" onClick={() => setView("products")}>
          View Available Products & Discounts
        </button>
        <button className="action-button" onClick={() => setView("report")}>
          Generate Smart Report
        </button>
      </div>

      {view === "products" && (
        <div className="products-section">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <h4>{product.name}</h4>
                <p>Expiry: {product.expiry}</p>
                <p>Original: ₹{product.price}</p>
                {product.discount > 0 ? (
                  <p className="discounted">
                    Discount: {product.discount}% <br />
                    New Price: ₹
                    {(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </p>
                ) : (
                  <p>No discount</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "report" && (
        <div className="section-box">
          <h4>📊 Smart Logistics Report</h4>
          <ul>
            <li>Milk (Delhi) → Reroute to Mumbai (High Sales)</li>
            <li>Bread (Low demand) → Donate</li>
            <li>Chips → Keep in stock</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SalesUI;
