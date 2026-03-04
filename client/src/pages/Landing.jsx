import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    if (user.role === "student") navigate("/dashboard");
    else if (user.role === "college") navigate("/college");
    else navigate("/company");
    return null;
  }

  return (
    <div className="auth-page">
      <div className="landing-center">
        <h1>InternVerify</h1>
        <p>
          Internship & Certificate Verification & Approval System.
          Eliminate fake certificates with dual-approval from College and Company.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-outline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
