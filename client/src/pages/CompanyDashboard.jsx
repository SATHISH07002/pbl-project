import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

export default function CompanyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/company/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Company Dashboard">
      <h2 style={{ marginBottom: "1.5rem" }}>Company Dashboard</h2>

      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.totalInternsCompleted ?? 0}</div>
          <div className="label">Total Interns Completed</div>
        </div>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.yetToComplete ?? 0}</div>
          <div className="label">Yet to Complete</div>
        </div>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.pendingApproval ?? 0}</div>
          <div className="label">Pending Approval</div>
        </div>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.rejected ?? 0}</div>
          <div className="label">Rejected</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Quick Actions</div>
        <p style={{ color: "var(--color-text-muted)" }}>
          Go to <Link to="/company/approvals">Pending Approvals</Link> to approve certificates and generate QR.
          Go to <Link to="/company/offers">Post Offers</Link> to create internship offers.
        </p>
      </div>
    </Layout>
  );
}
