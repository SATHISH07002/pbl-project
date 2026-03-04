/**
 * Public Verification Page - No auth required
 * GET /verify/:certificateId
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Verify() {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!certificateId) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/internships/verify/${certificateId}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => setData({ valid: false }))
      .finally(() => setLoading(false));
  }, [certificateId]);

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-box">
          <p>Verifying...</p>
        </div>
      </div>
    );
  }

  if (!data?.valid) {
    return (
      <div className="auth-page">
        <div className="auth-box">
          <h1 style={{ color: "var(--color-danger)" }}>Certificate Not Found / Invalid</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: "1rem" }}>
            The certificate ID may be incorrect or the certificate has not been verified.
          </p>
          <Link to="/" className="btn btn-outline" style={{ marginTop: "1.5rem" }}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ maxWidth: 500 }}>
        <h1 style={{ color: "var(--color-success)" }}>✓ Verified Certificate</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          This certificate has been verified by InternVerify.
        </p>
        <div
          style={{
            background: "var(--color-bg)",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <p><strong>Student Name:</strong> {data.studentName}</p>
          <p><strong>College:</strong> {data.college}</p>
          <p><strong>Company:</strong> {data.company}</p>
          <p><strong>Internship Role:</strong> {data.role}</p>
          <p><strong>Duration:</strong> {data.duration} days</p>
          <p><strong>Verification Status:</strong> Verified</p>
          <p><strong>Verified At:</strong> {new Date(data.verifiedAt).toLocaleString()}</p>
        </div>
        <Link to="/" className="btn btn-primary">
          Verify Another
        </Link>
      </div>
    </div>
  );
}
