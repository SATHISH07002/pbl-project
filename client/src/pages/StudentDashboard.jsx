import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

const baseUrl = () =>
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/my")
      .then((res) => setInternships(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const approved = internships.filter((i) => i.status === "approved");
  const pendingCollege = internships.filter((i) => i.status === "pending_college");
  const pendingCompany = internships.filter((i) => i.status === "pending_company");
  const rejected = internships.filter(
    (i) => i.status === "rejected_college" || i.status === "rejected_company"
  );

  return (
    <Layout title="Student Dashboard">
      <h2 style={{ marginBottom: "1.5rem" }}>Welcome back!</h2>

      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <div className="value">{approved.length}</div>
          <div className="label">Fully Approved</div>
        </div>
        <div className="stat-card">
          <div className="value">{pendingCollege.length}</div>
          <div className="label">Pending College</div>
        </div>
        <div className="stat-card">
          <div className="value">{pendingCompany.length}</div>
          <div className="label">Pending Company</div>
        </div>
        <div className="stat-card">
          <div className="value">{rejected.length}</div>
          <div className="label">Rejected</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Internships</div>
        {loading ? (
          <p>Loading...</p>
        ) : internships.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>
            No internships yet. Upload a certificate to get started.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {internships.slice(0, 10).map((i) => (
                  <tr key={i._id}>
                    <td>{i.companyName}</td>
                    <td>{i.roleInInternship}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          i.status === "approved"
                            ? "success"
                            : i.status.includes("rejected")
                            ? "danger"
                            : "pending"
                        }`}
                      >
                        {i.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
