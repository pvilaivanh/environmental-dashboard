import { useEffect, useState } from "react";
import "./Pages.css";

function OutdoorHistory() {
  const [data, setData] = useState([]);
  const [openMonth, setOpenMonth] = useState(null);
  const [openDays, setOpenDays] = useState({});

  const groupedByMonthAndDay = data
    .slice()
    .sort((a, b) => new Date(b.Created) - new Date(a.Created))
    .reduce((acc, item) => {
      const createdDate = new Date(item.Created);
      const monthKey = createdDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });
      const dayKey = createdDate.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = {};
      }

      if (!acc[monthKey][dayKey]) {
        acc[monthKey][dayKey] = [];
      }

      acc[monthKey][dayKey].push(item);
      return acc;
    }, {});

  useEffect(() => {
    fetch("https://localhost:7220/api/reports")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleMonth = (month) => {
    setOpenMonth((current) => (current === month ? null : month));
  };

  const toggleDay = (month, day) => {
    setOpenDays((current) => ({
      ...current,
      [month]: current[month] === day ? null : day,
    }));
  };

  return (
    <div className="page-content">
      <div className="history-card">
        <h1 className="history-title">Outdoor Temperature History</h1>

        {data.length === 0 ? (
          <p className="history-loading">Loading...</p>
        ) : (
          <div className="history-tree">
            {Object.entries(groupedByMonthAndDay).map(([month, days]) => (
              <section className="history-month" key={month}>
                <button
                  type="button"
                  className="history-folder-btn month-btn"
                  onClick={() => toggleMonth(month)}
                >
                  <span>{openMonth === month ? "[-]" : "[+]"}</span>
                  <span>{month}</span>
                </button>

                {openMonth === month && (
                  <div className="history-tree-children">
                    {Object.entries(days).map(([day, items]) => (
                      <article className="history-day-box" key={day}>
                        <button
                          type="button"
                          className="history-folder-btn day-btn"
                          onClick={() => toggleDay(month, day)}
                        >
                          <span>{openDays[month] === day ? "[-]" : "[+]"}</span>
                          <span>{day}</span>
                        </button>

                        {openDays[month] === day && (
                          <div className="history-day-list">
                            {items.map((item, index) => (
                              <div
                                className="history-day-item"
                                key={`${item.Created}-outdoor-${index}`}
                              >
                                <p className="history-day-meta">
                                  {new Date(item.Created).toLocaleTimeString()}
                                </p>
                                <p>
                                  Temp: {Math.round(item.Outdoor.TemperatureF)}
                                  °F
                                </p>
                                <p>
                                  Humidity: {Math.round(item.Outdoor.Humidity)}%
                                </p>
                                <p>Description: {item.Outdoor.Description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutdoorHistory;
