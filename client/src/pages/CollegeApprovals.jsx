import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

const baseUrl = () =>
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function CollegeApprovals() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    API.get("/internships/college/pending")
      .then((res) => setList(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await API.post(`/internships/college/${id}/approve`);
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = rejectReason[id];
    if (!reason || reason.trim().length < 5) {
      alert("Please provide a rejection reason (min 5 characters)");
      return;
    }
    setActionLoading(id);
    try {
      await API.post(`/internships/college/${id}/reject`, { reason });
      setRejectReason((p) => ({ ...p, [id]: "" }));
      fetchList();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout title="Pending Approvals">
      <div className="card">
        <div className="card-title">Pending College Approval</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          View student details and certificate. Approve or Reject with reason.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : list.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>No pending approvals.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {list.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: "1.5rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <strong>{item.studentName}</strong>
                    <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                      Roll: {item.student?.rollNumber || "-"} | {item.degree} {item.branch}
                    </p>
                    <p>Company: {item.companyName} | Role: {item.roleInInternship}</p>
                    <p>Duration: {item.duration} days</p>
                  </div>
                  <div>
                    {item.certificateFile && (
                      <a
                        href={`${baseUrl()}/uploads/${item.certificateFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: "1rem" }}>
                  <label>Rejection reason (if rejecting)</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Required if you reject (min 5 chars)"
                    value={rejectReason[item._id] || ""}
                    onChange={(e) =>
                      setRejectReason((p) => ({ ...p, [item._id]: e.target.value }))
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleApprove(item._id)}
                    disabled={actionLoading === item._id}
                  >
                    {actionLoading === item._id ? "..." : "Approve"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleReject(item._id)}
                    disabled={actionLoading === item._id}
                  >
                    {actionLoading === item._id ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
