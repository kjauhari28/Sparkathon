import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreUi.css";

const mockStores = [
  { id: 1, name: "Store A", geo: "Delhi", religion: "Hindu" },
  { id: 2, name: "Store B", geo: "Mumbai", religion: "Muslim" },
  { id: 3, name: "Store C", geo: "Bangalore", religion: "Christian" },
];

const StoreUI = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedReligion, setSelectedReligion] = useState("");
  const navigate = useNavigate();

  const locations = [...new Set(mockStores.map(s => s.geo))];
  const religions = [...new Set(mockStores.map(s => s.religion))];

  const filteredStores = mockStores.filter((store) => {
    const matchLocation = selectedLocation ? store.geo === selectedLocation : true;
    const matchReligion = selectedReligion ? store.religion === selectedReligion : true;
    return matchLocation && matchReligion;
  });

  return (
    <div className="store-wrapper">
      <div className="store-container">
        <h2>Stores</h2>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc}>{loc}</option>)}
          </select>
          <select value={selectedReligion} onChange={(e) => setSelectedReligion(e.target.value)}>
            <option value="">All Religions</option>
            {religions.map(rel => <option key={rel}>{rel}</option>)}
          </select>
        </div>

        <div className="store-list">
          {filteredStores.map(store => (
            <div
              key={store.id}
              className="store-card"
              onClick={() => navigate(`/sales/${store.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{store.name}</h3>
              <p>Location: {store.geo}</p>
              <p>Religion: {store.religion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreUI;
