import { useEffect, useState } from "react";

function IndoorHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7220/api/reports")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-content">
      <h1>Indoor Temperature History</h1>

      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Time</th>
              <th>Temp (°F)</th>
              <th>Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.Created).toLocaleString()}</td>
                <td>{Math.round(item.Indoor.TemperatureF)}</td>
                <td>{Math.round(item.Indoor.Humidity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IndoorHistory;