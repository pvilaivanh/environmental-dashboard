import { useEffect, useState } from "react";
import "./Pages.css";

function OutdoorHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7220/api/reports")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="page-content">
      <div className="history-card">
        <h1 className="history-title">Outdoor Temperature History</h1>

        {data.length === 0 ? (
          <p className="history-loading">Loading...</p>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Temp (°F)</th>
                  <th>Humidity (%)</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.Created).toLocaleString()}</td>
                    <td>{Math.round(item.Outdoor.TemperatureF)}</td>
                    <td>{Math.round(item.Outdoor.Humidity)}</td>
                    <td>{item.Outdoor.Description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutdoorHistory;
