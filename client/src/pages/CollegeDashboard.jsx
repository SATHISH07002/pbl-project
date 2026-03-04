import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

export default function CollegeDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/college/stats")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="College Dashboard">
      <h2 style={{ marginBottom: "1.5rem" }}>College Dashboard</h2>

      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.totalStudentsOngoing ?? 0}</div>
          <div className="label">Total Students Ongoing Internship</div>
        </div>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.totalPendingApprovals ?? 0}</div>
          <div className="label">Total Pending Approvals</div>
        </div>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.totalApproved ?? 0}</div>
          <div className="label">Total Approved</div>
        </div>
        <div className="stat-card">
          <div className="value">{loading ? "-" : stats?.totalRejected ?? 0}</div>
          <div className="label">Total Rejected</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Quick Actions</div>
        <p style={{ color: "var(--color-text-muted)" }}>
          Go to <Link to="/college/approvals">Pending Approvals</Link> to approve or reject certificates.
        </p>
      </div>
    </Layout>
  );
}
