import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/offers/my")
      .then((res) => setOffers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id) => {
    try {
      await API.post(`/offers/${id}/accept`);
      setOffers((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "accepted" } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/offers/${id}/reject`);
      setOffers((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "rejected" } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const pending = offers.filter((o) => o.status === "pending");

  return (
    <Layout title="Offers">
      <div className="card">
        <div className="card-title">Internship / Job Offers</div>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Offers from companies. Accept or Reject.
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : offers.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>No offers yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o._id}>
                    <td>{o.issuedBy?.companyName || o.issuedBy?.name}</td>
                    <td>{o.title}</td>
                    <td>{o.offerType}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          o.status === "accepted"
                            ? "success"
                            : o.status === "rejected"
                            ? "danger"
                            : "pending"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {o.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAccept(o._id)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(o._id)}
                            style={{ marginLeft: "0.5rem" }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
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
