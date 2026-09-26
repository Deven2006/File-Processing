import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          Serverless File Processing
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">History</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;