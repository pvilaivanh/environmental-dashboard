import { useEffect, useState } from "react";
import "./Pages.css";

// OutdoorHistory component displays historical outdoor temperature and humidity data grouped by month and day with collapsible sections
function OutdoorHistory() {
  const [data, setData] = useState([]); // Indoor/outdoor reports from backend
  const [openMonth, setOpenMonth] = useState(null); // Currently open month in the history tree
  const [openDays, setOpenDays] = useState({}); // Object tracking which day is open for each month

  // Group data by month and day for display in collapsible tree structure
  const groupedByMonthAndDay = data
    .slice()
    .sort((a, b) => new Date(b.Created) - new Date(a.Created))
    .reduce((acc, item) => {
      const createdDate = new Date(item.Created); // Convert Created timestamp to Date object

      // Format month key as "Month Year" (e.g., "January 2024")
      const monthKey = createdDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });

      // Format day key as "Weekday, Month Day, Year" (e.g., "Monday, January 1, 2024")
      const dayKey = createdDate.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Initialize month and day groups if they don't exist, then add the item to the appropriate group
      if (!acc[monthKey]) {
        acc[monthKey] = {};
      }

      // Initialize day group if it doesn't exist, then add the item to the appropriate month/day group
      if (!acc[monthKey][dayKey]) {
        acc[monthKey][dayKey] = [];
      }

      // Add the current item to the correct month/day group
      acc[monthKey][dayKey].push(item);
      return acc;
    }, {});

  useEffect(() => {
    fetch("https://localhost:7220/api/reports")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  // Toggle the open/closed state of a month in the history tree
  const toggleMonth = (month) => {
    setOpenMonth((current) => (current === month ? null : month));
  };

  // Toggle the open/closed state of a day within a month in the history tree
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
