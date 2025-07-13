import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreUi.css";

// Mock store data
const mockStores = [
  { id: 1, name: "Store A", geo: "Delhi", religion: "Hindu" },
  { id: 2, name: "Store B", geo: "Mumbai", religion: "Muslim" },
  { id: 3, name: "Store C", geo: "Bangalore", religion: "Christian" },
];

const StoreUI = () => {
  const navigate = useNavigate();

  // Search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedReligion, setSelectedReligion] = useState("");

  // Get unique locations and religions from the store list
  const locations = [...new Set(mockStores.map((s) => s.geo))];
  const religions = [...new Set(mockStores.map((s) => s.religion))];

  // Combine filters and search term to filter the store list
  const filteredStores = mockStores.filter((store) => {
    const matchLocation = selectedLocation ? store.geo === selectedLocation : true;
    const matchReligion = selectedReligion ? store.religion === selectedReligion : true;
    const matchSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchLocation && matchReligion && matchSe
