import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

export default function CompanyRejected() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/company/rejected")
      .then((res) => setList(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Rejected">
      <div className="card">
        <div className="card-title">Rejected by Company</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Students and rejection reasons.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>None rejected.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Company</th>
                  <th>Rejection Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {list.map((i) => (
                  <tr key={i._id}>
                    <td>{i.student?.name}</td>
                    <td>{i.companyName}</td>
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
