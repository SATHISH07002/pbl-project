import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

const baseUrl = () =>
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function Approvals() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/internships/my")
      .then((res) => setInternships(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const approved = internships.filter((i) => i.status === "approved");

  return (
    <Layout title="Approvals">
      <div className="card">
        <div className="card-title">Approved by College & Company</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Fully verified certificates with Certificate ID and QR Code.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : approved.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>No approved certificates yet.</p>
        ) : (
          <div className="grid-2">
            {approved.map((i) => (
              <div key={i._id} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <strong>{i.companyName}</strong>
                  <span className="badge badge-success">Approved</span>
                </div>
                <p>{i.roleInInternship} • {i.duration} days</p>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                  College: {i.college?.collegeName || i.college?.name} | Company: {i.company?.companyName || i.company?.name}
                </p>
                {i.certificateId && (
                  <div style={{ marginTop: "1rem" }}>
                    <p style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
                      Certificate ID: {i.certificateId}
                    </p>
                    {i.qrCode && (
                      <img
                        src={i.qrCode}
                        alt="QR"
                        style={{ width: 120, height: 120, marginTop: "0.5rem" }}
                      />
                    )}
                    <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                      Verified: {new Date(i.verifiedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
