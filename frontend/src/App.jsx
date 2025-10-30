import { Outlet, useLocation, Link } from 'react-router-dom';
import Silk from './components/Silk';
import './App.css';

function App() {
  const location = useLocation();
  // Add a class 'is-history-page' if the path is /history
  const containerClass = location.pathname === '/history' 
    ? "app-container is-history-page" 
    : "app-container";

  return (
    <div className={containerClass}> {/* Use the dynamic class here */}
      <Silk
        speed={5}
        scale={1.5}
        color="#2C2C3E"
        noiseIntensity={1.2}
      />
      <main className="content">
        <Outlet />
      </main>
      
      <nav className="page-nav">
        {location.pathname === '/history' ? (
          <Link to="/">Go to Uploader</Link>
        ) : (
          <Link to="/history">View Upload History</Link>
        )}
      </nav>
    </div>
  );
}

export default App;