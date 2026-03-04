/**
 * Layout - Sidebar + Top Navbar
 */
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getApiBase = () =>
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const baseUrl = getApiBase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const studentLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
    { to: "/upload-certificate", label: "Certificate Upload" },
    { to: "/approvals", label: "Approvals" },
    { to: "/pending", label: "Pending" },
    { to: "/rejected", label: "Rejected" },
    { to: "/offers", label: "Offers" },
    { to: "/notifications", label: "Notifications" },
    { to: "/qr-codes", label: "QR Codes" },
  ];

  const collegeLinks = [
    { to: "/college", label: "Dashboard" },
    { to: "/college/approvals", label: "Pending Approvals" },
    { to: "/college/rejected", label: "Rejected" },
  ];

  const companyLinks = [
    { to: "/company", label: "Dashboard" },
    { to: "/company/approvals", label: "Pending Approvals" },
    { to: "/company/rejected", label: "Rejected" },
    { to: "/company/offers", label: "Post Offers" },
  ];

  const links =
    user?.role === "student"
      ? studentLinks
      : user?.role === "college"
      ? collegeLinks
      : companyLinks;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">InternVerify</div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="navbar">
          <span className="navbar-title">{title || "Dashboard"}</span>
          <div className="navbar-user">
            {user?.profileImage ? (
              <img
                src={`${baseUrl}/uploads/${user.profileImage}`}
                alt="Profile"
              />
            ) : (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0) || "?"}
              </div>
            )}
            <span>{user?.name}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
