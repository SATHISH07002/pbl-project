import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

export default function QRCodes() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/my")
      .then((res) => setInternships(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const approved = internships.filter((i) => i.status === "approved" && i.qrCode);

  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;

  return (
    <Layout title="QR Codes">
      <div className="card">
        <div className="card-title">QR Codes & Verification Links</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Share these for public verification. Each verified certificate has a unique ID and QR.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : approved.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>
            No verified certificates yet. Get your certificate approved by both College and Company.
          </p>
        ) : (
          <div className="grid-2">
            {approved.map((i) => (
              <div key={i._id} className="card" style={{ marginBottom: 0 }}>
                <strong>{i.companyName}</strong>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                  {i.roleInInternship} • {i.duration} days
                </p>
                {i.qrCode && (
                  <img
                    src={i.qrCode}
                    alt="QR"
                    style={{ width: 180, height: 180, margin: "1rem 0" }}
                  />
                )}
                <p style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
                  ID: {i.certificateId}
                </p>
                <Link
                  to={`/verify/${i.certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: "0.5rem" }}
                >
                  Open Verification Page
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
