import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

export default function Rejected() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/my")
      .then((res) => setInternships(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const rejected = internships.filter(
    (i) => i.status === "rejected_college" || i.status === "rejected_company"
  );

  return (
    <Layout title="Rejected">
      <div className="card">
        <div className="card-title">Rejected Certificates</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Rejected by College or Company with reason.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : rejected.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>No rejections.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Rejected By</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rejected.map((i) => (
                  <tr key={i._id}>
                    <td>{i.companyName}</td>
                    <td>{i.roleInInternship}</td>
                    <td>
                      <span className="badge badge-danger">
                        {i.status === "rejected_college" ? "College" : "Company"}
                      </span>
                    </td>
                    <td>{i.rejectionReason || "-"}</td>
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
