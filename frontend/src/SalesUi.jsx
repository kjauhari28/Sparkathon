import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SalesUi.css";

const mockSalesData = [
  { id: 1, storeId: 1, date: "2025-07-01", initial: 100, sold: 80, returns: 5, donations: 2, recycled: 3, final: 10 },
  { id: 2, storeId: 1, date: "2025-07-02", initial: 150, sold: 120, returns: 10, donations: 5, recycled: 2, final: 13 },
  { id: 3, storeId: 2, date: "2025-07-01", initial: 200, sold: 150, returns: 10, donations: 5, recycled: 10, final: 25 },
];

const SalesUI = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const data = mockSalesData.filter((s) => s.storeId === Number(storeId));

  return (
    <div className="sales-wrapper">
     <button className="back-button" onClick={() => navigate("/")}>← Back to Stores</button>

      <h3>📊 Sales Data for Store ID {storeId}</h3>

      {data.length > 0 ? (
        <div className="sales-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Initial</th>
                <th>Sold</th>
                <th>Returns</th>
                <th>Donations</th>
                <th>Recycled</th>
                <th>Final</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.date}</td>
                  <td>{sale.initial}</td>
                  <td>{sale.sold}</td>
                  <td>{sale.returns}</td>
                  <td>{sale.donations}</td>
                  <td>{sale.recycled}</td>
                  <td>{sale.final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No sales data found.</p>
      )}
    </div>
  );
};

export default SalesUI;
