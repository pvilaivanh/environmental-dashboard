
// About page with information about the ENVIROMonitor 1000 project, team, and contact details.
function About() {
  return (
    <div className="page-content">
      <div className="title">
        <h1>About ENVIROMonitor 1000</h1>
        <p>
          ENVIROMonitor 1000 is a personal environmental monitoring dashboard designed to provide real-time insights into indoor and outdoor conditions. It integrates data from various sensors and weather APIs to help users make informed decisions about their environment.
        </p>
      </div>

      <div className="about-us">
        <h2>About Us</h2>
        <p>
          We are a team of environmental enthusiasts and developers passionate about creating tools that empower individuals to understand and improve their surroundings. 
        </p>
        <p>
          Our mission is to provide accessible and actionable environmental data to help people live healthier and more sustainable lives.
        </p>

        <h2>Team</h2>
        <ul>
          <li><strong>Punoi Vilaivanh:</strong> Frontend/Backend Developer</li>
          <li><strong>Jacob Hammonds:</strong> Frontend/CSS Designer</li>
        </ul>
      </div>

      <div className="features">
        <h2>Features</h2>
        <ul>
          <li><strong>Real-Time Data:</strong> Get up-to-date information on indoor temperature, humidity, and outdoor weather conditions.</li>
          <li><strong>Historical Data:</strong> Access past environmental data to identify trends and patterns.</li>
          <li><strong>Forecasting:</strong> Receive weather forecasts to plan your activities accordingly.</li>
        </ul>

      </div>

      <div className="technology-stack">
        <h2>Technology Stack</h2>
        <ul>
          <li><strong>Frontend:</strong> React.js for building the user interface.</li>
          <li><strong>Backend:</strong> Node.js and Express for handling API requests and data processing.</li>
          <li><strong>APIs:</strong> OpenWeatherMap API for fetching outdoor weather data.</li>
        </ul>
      </div>

      <div className="contact">
        <h2>Contact</h2>
        <p>
          For feedback, suggestions, or inquiries, please contact us at <a href="mailto:pvilaivanh@gmail.com">pvilaivanh@gmail.com</a>.
        </p>
      </div>

      <div className="disclaimer">
        <h2>Disclaimer</h2>
        <p>
          ENVIROMonitor 1000 is intended for informational purposes only. The data provided is based on sensor readings and third-party APIs, which may not always be accurate. Always use your judgment and consult professionals when necessary.
        </p>
      </div>

    </div>
  );
}

export default About;