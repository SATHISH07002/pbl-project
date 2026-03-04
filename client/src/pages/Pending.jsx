import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

const baseUrl = () =>
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function Pending() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/my")
      .then((res) => setInternships(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingCollege = internships.filter((i) => i.status === "pending_college");
  const pendingCompany = internships.filter((i) => i.status === "pending_company");

  return (
    <Layout title="Pending">
      <div className="card">
        <div className="card-title">Pending College Approval</div>
        {loading ? (
          <p>Loading...</p>
        ) : pendingCollege.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>None pending.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {pendingCollege.map((i) => (
                  <tr key={i._id}>
                    <td>{i.companyName}</td>
                    <td>{i.roleInInternship}</td>
                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Pending Company Approval</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
          Already approved by college. Waiting for company.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : pendingCompany.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>None pending.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>College Approved</th>
                </tr>
              </thead>
              <tbody>
                {pendingCompany.map((i) => (
                  <tr key={i._id}>
                    <td>{i.companyName}</td>
                    <td>{i.roleInInternship}</td>
                    <td>{new Date(i.updatedAt).toLocaleDateString()}</td>
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
